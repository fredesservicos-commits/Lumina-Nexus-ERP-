### 📊 4. ERP Completo (`skills/erp-complete/SKILL.md`)

```markdown
# Agent Skill: Corporate ERP Orchestrator & Ledger Management
> **ID**: `org.opencode.skills.erp.complete`  
> **Version**: `1.0.0`  
> **Protocol**: `MCP / Open Code SQL Environment`

Controla a inteligência financeira do negócio, sincronização de faturas via e-mail (`gog`) e projeções de tesouraria.

## 🛠️ 1. Tool Definitions

### 💰 4.1 `forecast_cashflow_90_days`
Vaide contra o histórico contabilístico do banco de dados e projeta o fluxo de caixa para os próximos meses.

```json
{
  "name": "forecast_cashflow_90_days",
  "description": "Queries historical accounts payable and receivable data to build a 90-day predictive cash flow model.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "include_pending_invoices": { "type": "boolean", "default": true },
      "confidence_interval": { "type": "number", "default": 0.95 }
    }
  }
}

{
  "name": "sync_gog_invoice_to_ledger",
  "description": "Parses a document retrieved from gog (Google Workspace) and inserts a standardized financial record into the ERP database.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "gog_file_id": { "type": "string", "description": "The document identifier from Google Drive/Gmail." },
      "category": { "type": "string", "description": "Cost center allocation (e.g., 'Hosting', 'Office Supplies')." }
    },
    "required": ["gog_file_id", "category"]
  }
}