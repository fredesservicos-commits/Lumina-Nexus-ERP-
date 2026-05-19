import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/app/rh")({
  component: RHPage,
});

interface Employee {
  id: string;
  department: string | null;
  hire_date: string;
  base_salary: number;
  monthly_cost: number;
}

function RHPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [department, setDepartment] = useState("");
  const [salary, setSalary] = useState("");

  const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const load = async () => {
    try {
      const res = await fetch(`${API}/employees/list`);
      const data = await res.json();
      setEmployees(data);
    } catch {
      console.error("Erro ao carregar funcionários");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async () => {
    if (!department || !salary) return;
    try {
      await fetch(`${API}/employees/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partner_id: "00000000-0000-0000-0000-000000000000",
          department,
          hire_date: new Date().toISOString().split("T")[0],
          base_salary: parseFloat(salary),
        }),
      });
      setDepartment("");
      setSalary("");
      load();
    } catch {
      console.error("Erro ao registrar funcionário");
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Recursos Humanos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gestão de funcionários e custos de RH
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm">
        <h2 className="mb-4 text-sm font-semibold">Novo Funcionário</h2>
        <div className="flex gap-3">
          <div className="flex-1">
            <Label className="mb-1 text-xs">Departamento</Label>
            <Input
              placeholder="Ex: TI, Vendas, RH..."
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Label className="mb-1 text-xs">Salário Base (R$)</Label>
            <Input
              type="number"
              placeholder="5000.00"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleSubmit}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Departamento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Salário Base
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Custo Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Admissão
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-sm">{emp.department}</td>
                <td className="px-6 py-4 text-sm">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(emp.base_salary)}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(emp.monthly_cost)}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {new Date(emp.hire_date).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-sm text-muted-foreground"
                >
                  Nenhum funcionário cadastrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
