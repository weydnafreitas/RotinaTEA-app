/**
 * Converte data no formato DD/MM/YYYY para ISO string
 * @param dateString Data no formato DD/MM/YYYY
 * @returns Data no formato ISO (YYYY-MM-DD)
 */
export function formatDateToISO(dateString: string): string {
  // Remove qualquer caractere que não seja número ou barra
  const cleaned = dateString.replace(/[^\d/]/g, "");

  // Separa dia, mês e ano
  const parts = cleaned.split("/");

  if (parts.length !== 3) {
    throw new Error("Formato de data inválido. Use DD/MM/YYYY");
  }

  const [day, month, year] = parts;

  // Valida os valores
  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);

  if (dayNum < 1 || dayNum > 31) {
    throw new Error("Dia inválido");
  }

  if (monthNum < 1 || monthNum > 12) {
    throw new Error("Mês inválido");
  }

  if (yearNum < 1900 || yearNum > new Date().getFullYear()) {
    throw new Error("Ano inválido");
  }

  // Cria a data no formato ISO
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

/**
 * Formata data ISO para formato brasileiro DD/MM/YYYY
 * @param isoDate Data no formato ISO
 * @returns Data no formato DD/MM/YYYY
 */
export function formatISOToDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Valida se a data está no formato DD/MM/YYYY
 * @param dateString Data a ser validada
 * @returns true se válido, false caso contrário
 */
export function isValidDateFormat(dateString: string): boolean {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  return regex.test(dateString);
}
