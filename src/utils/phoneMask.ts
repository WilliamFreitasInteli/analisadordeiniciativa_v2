/**
 * Utilitário de máscara e validação de telefone brasileiro
 * Suporta telefones celulares (11 dígitos: DDD + 9 dígitos) e fixos (10 dígitos: DDD + 8 dígitos)
 */

export function maskPhone(value: string): string {
  if (!value) return '';
  // Keep only digits
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 2) {
    return digits ? `(${digits}` : '';
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    // Fixo format: (XX) XXXX-XXXX
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  // Celular format: (XX) XXXXX-XXXX
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

export function validatePhone(value: string): { isValid: boolean; message?: string } {
  if (!value || !value.trim()) {
    return { isValid: false, message: 'O telefone é obrigatório.' };
  }

  const digits = value.replace(/\D/g, '');

  if (digits.length < 10) {
    return { isValid: false, message: 'Telefone incompleto (mínimo de 10 dígitos com DDD).' };
  }

  if (digits.length > 11) {
    return { isValid: false, message: 'Telefone excede 11 dígitos.' };
  }

  // Valid DDD range in Brazil: 11 to 99
  const ddd = parseInt(digits.slice(0, 2), 10);
  if (isNaN(ddd) || ddd < 11 || ddd > 99) {
    return { isValid: false, message: 'DDD inválido. Informe um DDD brasileiro válido (11 a 99).' };
  }

  // For 11 digits (mobile), the 3rd digit should be 9 in Brazil
  if (digits.length === 11 && digits.charAt(2) !== '9') {
    return { isValid: false, message: 'Celular com 11 dígitos deve iniciar com o dígito 9 após o DDD.' };
  }

  // Reject obvious invalid repeating patterns like 11111111111
  const allSame = digits.split('').every((char) => char === digits[0]);
  if (allSame) {
    return { isValid: false, message: 'Número de telefone inválido (todos os dígitos repetidos).' };
  }

  return { isValid: true };
}
