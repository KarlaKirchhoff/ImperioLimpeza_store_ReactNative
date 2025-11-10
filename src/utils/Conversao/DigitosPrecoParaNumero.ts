const DigitosPrecoParaNumero = (digits: string) => {
    const clean = digits.replace(/\D/g, "");
    if (!clean) return 0;
    const len = clean.length;
    const intPart = clean.slice(0, len - 2) || "0";
    const cents = clean.slice(len - 2).padStart(2, "0");
    const join = `${intPart}.${cents}`;
    return Number(join);
};
