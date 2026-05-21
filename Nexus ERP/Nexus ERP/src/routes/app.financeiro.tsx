import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/lib/api";
import { BookOpen, Plus, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Account {
  id: number;
  code: string;
  name: string;
  account_type: string;
}

interface LedgerItem {
  id: string;
  account_id: number;
  debit: number;
  credit: number;
}

interface LedgerEntry {
  id: string;
  description: string | null;
  transaction_date: string;
  created_at: string;
  items: LedgerItem[];
}

interface Summary {
  total_debits: number;
  total_credits: number;
  balance: number;
  entry_count: number;
}

export const Route = createFileRoute("/app/financeiro")({
  component: FinanceiroPage,
});

function FinanceiroPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [tab, setTab] = useState<"visao" | "contas" | "lancamentos">("visao");

  const [code, setCode] = useState("");
  const [accName, setAccName] = useState("");
  const [accType, setAccType] = useState("");

  // Estados para o formulário de Novo Lançamento
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [entryDescription, setEntryDescription] = useState("");
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split("T")[0]);
  const [entryItems, setEntryItems] = useState<
    { accountId: string; debit: string; credit: string }[]
  >([
    { accountId: "", debit: "0", credit: "0" },
    { accountId: "", debit: "0", credit: "0" },
  ]);

  const loadData = async () => {
    try {
      const [a, e, s] = await Promise.all([
        api.get<Account[]>("/finance/accounts"),
        api.get<LedgerEntry[]>("/finance/ledger"),
        api.get<Summary>("/finance/summary"),
      ]);
      setAccounts(a);
      setEntries(e);
      setSummary(s);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateAccount = async () => {
    if (!code || !accName || !accType) return;
    try {
      await api.post("/finance/accounts", { code, name: accName, account_type: accType });
      setCode("");
      setAccName("");
      setAccType("");
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleItemChange = (
    index: number,
    field: "accountId" | "debit" | "credit",
    value: string,
  ) => {
    const updated = [...entryItems];
    if (field === "debit") {
      updated[index] = {
        ...updated[index],
        debit: value,
        credit: value !== "0" && value !== "" ? "0" : updated[index].credit,
      };
    } else if (field === "credit") {
      updated[index] = {
        ...updated[index],
        credit: value,
        debit: value !== "0" && value !== "" ? "0" : updated[index].debit,
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setEntryItems(updated);
  };

  const addEntryItemRow = () => {
    setEntryItems([...entryItems, { accountId: "", debit: "0", credit: "0" }]);
  };

  const removeEntryItemRow = (index: number) => {
    if (entryItems.length <= 2) return;
    setEntryItems(entryItems.filter((_, i) => i !== index));
  };

  const totalDebits = entryItems.reduce((sum, item) => sum + (parseFloat(item.debit) || 0), 0);
  const totalCredits = entryItems.reduce((sum, item) => sum + (parseFloat(item.credit) || 0), 0);
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;
  const isFormValid =
    showEntryForm &&
    entryDescription.trim() !== "" &&
    isBalanced &&
    totalDebits > 0 &&
    entryItems.every(
      (item) =>
        item.accountId !== "" &&
        ((parseFloat(item.debit) || 0) > 0 || (parseFloat(item.credit) || 0) > 0),
    );

  const handleCreateEntry = async () => {
    if (!isFormValid) return;
    try {
      const payload = {
        description: entryDescription,
        transaction_date: new Date(entryDate).toISOString(),
        items: entryItems.map((item) => ({
          account_id: parseInt(item.accountId),
          debit: parseFloat(item.debit) || 0,
          credit: parseFloat(item.credit) || 0,
        })),
      };
      await api.post("/finance/ledger", payload);

      setEntryDescription("");
      setEntryDate(new Date().toISOString().split("T")[0]);
      setEntryItems([
        { accountId: "", debit: "0", credit: "0" },
        { accountId: "", debit: "0", credit: "0" },
      ]);
      setShowEntryForm(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const typeLabel: Record<string, string> = {
    ASSET: "Ativo",
    LIABILITY: "Passivo",
    EQUITY: "Patrimônio Líquido",
    REVENUE: "Receita",
    EXPENSE: "Despesa",
  };

  const accountTypes = ["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Financeiro</h1>
        <p className="mt-1 text-sm text-muted-foreground">Plano de contas e razão contábil</p>
      </div>

      <div className="mb-6 flex gap-2">
        {[
          { key: "visao", label: "Visão Geral" },
          { key: "contas", label: "Plano de Contas" },
          { key: "lancamentos", label: "Lançamentos" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "visao" && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Débitos", value: summary?.total_debits ?? 0, color: "text-rose-400" },
            { label: "Créditos", value: summary?.total_credits ?? 0, color: "text-emerald-400" },
            {
              label: "Saldo",
              value: summary?.balance ?? 0,
              color: summary && summary.balance >= 0 ? "text-blue-400" : "text-rose-400",
            },
            {
              label: "Lançamentos",
              value: summary?.entry_count ?? 0,
              color: "text-violet-400",
              prefix: "",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm"
            >
              <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
              <p className={`mt-4 text-3xl font-bold tracking-tight ${card.color}`}>
                {card.prefix === ""
                  ? card.value
                  : new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(card.value)}
              </p>
            </div>
          ))}
        </div>
      )}

      {tab === "contas" && (
        <div>
          <div className="mb-6 rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-sm font-semibold">Nova Conta Contábil</h2>
            <div className="flex flex-wrap gap-3">
              <div className="w-24">
                <Label className="mb-1 text-xs">Código</Label>
                <Input placeholder="1.01" value={code} onChange={(e) => setCode(e.target.value)} />
              </div>
              <div className="flex-1">
                <Label className="mb-1 text-xs">Nome</Label>
                <Input
                  placeholder="Caixa"
                  value={accName}
                  onChange={(e) => setAccName(e.target.value)}
                />
              </div>
              <div className="w-44">
                <Label className="mb-1 text-xs">Tipo</Label>
                <Select value={accType} onValueChange={setAccType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountTypes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {typeLabel[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleCreateAccount}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Conta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Tipo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {accounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono">{acc.code}</td>
                    <td className="px-6 py-4 text-sm">{acc.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {typeLabel[acc.account_type] ?? acc.account_type}
                    </td>
                  </tr>
                ))}
                {accounts.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-12 text-center text-sm text-muted-foreground"
                    >
                      Nenhuma conta cadastrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "lancamentos" && (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-muted-foreground">Registros do Diário</h2>
            <Button
              onClick={() => setShowEntryForm(!showEntryForm)}
              variant={showEntryForm ? "outline" : "default"}
            >
              {showEntryForm ? "Cancelar" : "Novo Lançamento"}
            </Button>
          </div>

          {showEntryForm && (
            <div className="mb-6 rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-sm font-semibold">Novo Lançamento Diário</h3>

              <div className="grid gap-4 md:grid-cols-2 mb-6">
                <div>
                  <Label className="mb-1 text-xs">Descrição</Label>
                  <Input
                    placeholder="Ex: Pagamento de Aluguel"
                    value={entryDescription}
                    onChange={(e) => setEntryDescription(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="mb-1 text-xs">Data da Transação</Label>
                  <Input
                    type="date"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <Label className="text-xs">Itens do Lançamento (Mínimo 2)</Label>
                {entryItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-wrap md:flex-nowrap gap-3 items-end bg-white/[0.01] p-3 rounded-lg border border-white/[0.02]"
                  >
                    <div className="flex-1 min-w-[200px]">
                      <Label className="mb-1 text-xs text-muted-foreground">Conta Contábil</Label>
                      <Select
                        value={item.accountId}
                        onValueChange={(val) => handleItemChange(index, "accountId", val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a conta" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts.map((acc) => (
                            <SelectItem key={acc.id} value={acc.id.toString()}>
                              {acc.code} - {acc.name} (
                              {typeLabel[acc.account_type] || acc.account_type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-32">
                      <Label className="mb-1 text-xs text-muted-foreground">Débito (R$)</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={item.debit}
                        onChange={(e) => handleItemChange(index, "debit", e.target.value)}
                      />
                    </div>
                    <div className="w-32">
                      <Label className="mb-1 text-xs text-muted-foreground">Crédito (R$)</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={item.credit}
                        onChange={(e) => handleItemChange(index, "credit", e.target.value)}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEntryItemRow(index)}
                      disabled={entryItems.length <= 2}
                      className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button variant="outline" size="sm" onClick={addEntryItemRow} className="mt-2">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Linha
                </Button>
              </div>

              {/* Status e Totais */}
              <div className="flex flex-wrap justify-between items-center bg-white/[0.02] p-4 rounded-xl border border-white/5 gap-4">
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="text-muted-foreground mr-2">Total Débitos:</span>
                    <span className="font-bold text-rose-400">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(totalDebits)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground mr-2">Total Créditos:</span>
                    <span className="font-bold text-emerald-400">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(totalCredits)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {isBalanced ? (
                    <div className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 border border-emerald-500/20">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Lançamento Equilibrado
                    </div>
                  ) : (
                    <div className="text-xs text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 border border-rose-500/20">
                      <AlertCircle className="h-3 w-3" />
                      Diferença:{" "}
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(Math.abs(totalDebits - totalCredits))}
                    </div>
                  )}

                  <Button onClick={handleCreateEntry} disabled={!isFormValid}>
                    Salvar Lançamento
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Débitos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Créditos
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {entries.map((entry) => {
                  const totalDebit = entry.items.reduce((s, i) => s + i.debit, 0);
                  const totalCredit = entry.items.reduce((s, i) => s + i.credit, 0);
                  return (
                    <tr key={entry.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(entry.transaction_date).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4 text-sm">{entry.description || "-"}</td>
                      <td className="px-6 py-4 text-sm font-medium text-rose-400">
                        {totalDebit > 0
                          ? new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(totalDebit)
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-emerald-400">
                        {totalCredit > 0
                          ? new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(totalCredit)
                          : "-"}
                      </td>
                    </tr>
                  );
                })}
                {entries.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-sm text-muted-foreground"
                    >
                      Nenhum lançamento contábil
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
