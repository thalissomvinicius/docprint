import { jsPDF } from 'jspdf';

export interface InspectionData {
    // Property
    propertyAddress?: string;
    propertyType?: string;
    propertySize?: string;

    // Landlord
    landlordName?: string;
    landlordCPF?: string;
    landlordRG?: string;
    landlordAddress?: string;

    // Tenant
    tenantName?: string;
    tenantCPF?: string;
    tenantRG?: string;
    tenantAddress?: string;

    // Inspection
    inspectionDate?: string;
    inspectionPurpose?: 'entrada' | 'saída';
    livingRoom?: string;
    bedrooms?: string;
    kitchen?: string;
    bathrooms?: string;
    serviceArea?: string;
    generalObservations?: string;
}

export const generateInspectionPDF = (data: InspectionData) => {
    const doc = new jsPDF();
    let y = 20;
    const lineHeight = 7;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Helper to add text
    const addText = (text: string, fontSize = 11, isBold = false) => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');

        // Check if we need a new page
        if (y > 270) {
            doc.addPage();
            y = 20;
        }

        doc.text(text, 20, y);
        y += lineHeight;
    };

    const addSection = (title: string) => {
        y += 3;
        addText(title, 12, true);
        y += 2;
    };

    // Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('CONTRATO DE VISTORIA DE IMÓVEL', pageWidth / 2, y, { align: 'center' });
    y += 15;

    // Property Section
    addSection('DADOS DO IMÓVEL');
    if (data.propertyAddress) addText(`Endereço: ${data.propertyAddress}`);
    if (data.propertyType) addText(`Tipo: ${data.propertyType}`);
    if (data.propertySize) addText(`Metragem: ${data.propertySize} m²`);

    // Landlord Section
    addSection('LOCADOR/PROPRIETÁRIO');
    if (data.landlordName) addText(`Nome: ${data.landlordName}`);
    if (data.landlordCPF) addText(`CPF: ${data.landlordCPF}`);
    if (data.landlordRG) addText(`RG: ${data.landlordRG}`);
    if (data.landlordAddress) addText(`Endereço: ${data.landlordAddress}`);

    // Tenant Section
    addSection('LOCATÁRIO');
    if (data.tenantName) addText(`Nome: ${data.tenantName}`);
    if (data.tenantCPF) addText(`CPF: ${data.tenantCPF}`);
    if (data.tenantRG) addText(`RG: ${data.tenantRG}`);
    if (data.tenantAddress) addText(`Endereço: ${data.tenantAddress}`);

    // Inspection Details
    addSection('DADOS DA VISTORIA');
    if (data.inspectionDate) addText(`Data: ${data.inspectionDate}`);
    if (data.inspectionPurpose) addText(`Finalidade: ${data.inspectionPurpose === 'entrada' ? 'Entrada' : 'Saída'}`);

    // Condition by Room
    addSection('ESTADO DE CONSERVAÇÃO');
    if (data.livingRoom) addText(`Sala: ${data.livingRoom}`);
    if (data.bedrooms) addText(`Quartos: ${data.bedrooms}`);
    if (data.kitchen) addText(`Cozinha: ${data.kitchen}`);
    if (data.bathrooms) addText(`Banheiros: ${data.bathrooms}`);
    if (data.serviceArea) addText(`Área de Serviço: ${data.serviceArea}`);

    if (data.generalObservations) {
        addSection('OBSERVAÇÕES GERAIS');
        const lines = doc.splitTextToSize(data.generalObservations, pageWidth - 40);
        lines.forEach((line: string) => addText(line));
    }

    // Signatures
    y += 15;
    if (y > 240) {
        doc.addPage();
        y = 20;
    }

    doc.setFontSize(10);
    doc.text('_'.repeat(40), 20, y);
    doc.text('_'.repeat(40), pageWidth / 2 + 10, y);
    y += 5;
    doc.text('Locador/Proprietário', 20, y);
    doc.text('Locatário', pageWidth / 2 + 10, y);

    // Save
    doc.save(`vistoria_${data.inspectionDate || 'documento'}.pdf`);
};

// ===== RENTAL CONTRACT =====

export interface RentalData {
    // Landlord
    landlordName?: string;
    landlordCPF?: string;
    landlordRG?: string;
    landlordMaritalStatus?: string;
    landlordProfession?: string;
    landlordAddress?: string;

    // Tenant
    tenantName?: string;
    tenantCPF?: string;
    tenantRG?: string;
    tenantMaritalStatus?: string;
    tenantProfession?: string;
    tenantAddress?: string;

    // Property
    propertyAddress?: string;
    propertyDescription?: string;

    // Terms
    rentAmount?: string;
    dueDay?: string;
    depositAmount?: string;
    contractDuration?: string;
    startDate?: string;
    adjustmentIndex?: string;

    // Responsibilities
    iptuResponsible?: string;
    condominiumResponsible?: string;
    utilitiesResponsible?: string;

    // Penalties
    terminationFine?: string;
    noticePeriod?: string;

    // Witnesses
    witness1Name?: string;
    witness1CPF?: string;
    witness2Name?: string;
    witness2CPF?: string;
}

export const generateRentalPDF = (data: RentalData) => {
    const doc = new jsPDF();
    let y = 20;
    const lineHeight = 7;
    const pageWidth = doc.internal.pageSize.getWidth();

    const addText = (text: string, fontSize = 11, isBold = false) => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        doc.text(text, 20, y);
        y += lineHeight;
    };

    const addSection = (title: string) => {
        y += 3;
        addText(title, 12, true);
        y += 2;
    };

    // Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('CONTRATO DE LOCAÇÃO RESIDENCIAL', pageWidth / 2, y, { align: 'center' });
    y += 15;

    // Landlord
    addSection('LOCADOR');
    if (data.landlordName) addText(`Nome: ${data.landlordName}`);
    if (data.landlordCPF) addText(`CPF: ${data.landlordCPF}`);
    if (data.landlordRG) addText(`RG: ${data.landlordRG}`);
    if (data.landlordMaritalStatus) addText(`Estado Civil: ${data.landlordMaritalStatus}`);
    if (data.landlordProfession) addText(`Profissão: ${data.landlordProfession}`);
    if (data.landlordAddress) addText(`Endereço: ${data.landlordAddress}`);

    // Tenant
    addSection('LOCATÁRIO');
    if (data.tenantName) addText(`Nome: ${data.tenantName}`);
    if (data.tenantCPF) addText(`CPF: ${data.tenantCPF}`);
    if (data.tenantRG) addText(`RG: ${data.tenantRG}`);
    if (data.tenantMaritalStatus) addText(`Estado Civil: ${data.tenantMaritalStatus}`);
    if (data.tenantProfession) addText(`Profissão: ${data.tenantProfession}`);
    if (data.tenantAddress) addText(`Endereço: ${data.tenantAddress}`);

    // Property
    addSection('IMÓVEL');
    if (data.propertyAddress) addText(`Endereço: ${data.propertyAddress}`);
    if (data.propertyDescription) addText(`Descrição: ${data.propertyDescription}`);

    // Terms
    addSection('CONDIÇÕES');
    if (data.rentAmount) addText(`Valor do Aluguel: R$ ${data.rentAmount}`);
    if (data.dueDay) addText(`Vencimento: Dia ${data.dueDay} de cada mês`);
    if (data.depositAmount) addText(`Caução: R$ ${data.depositAmount}`);
    if (data.contractDuration) addText(`Prazo: ${data.contractDuration} meses`);
    if (data.startDate) addText(`Início: ${data.startDate}`);
    if (data.adjustmentIndex) addText(`Reajuste: ${data.adjustmentIndex} (anual)`);

    // Responsibilities
    addSection('RESPONSABILIDADES');
    if (data.iptuResponsible) addText(`IPTU: ${data.iptuResponsible}`);
    if (data.condominiumResponsible) addText(`Condomínio: ${data.condominiumResponsible}`);
    if (data.utilitiesResponsible) addText(`Água/Luz/Gás: ${data.utilitiesResponsible}`);

    // Penalties
    addSection('MULTAS E PRAZOS');
    if (data.terminationFine) addText(`Multa por rescisão: ${data.terminationFine}%`);
    if (data.noticePeriod) addText(`Aviso prévio: ${data.noticePeriod} dias`);

    // Witnesses
    if (data.witness1Name || data.witness2Name) {
        addSection('TESTEMUNHAS');
        if (data.witness1Name) addText(`1. ${data.witness1Name}${data.witness1CPF ? ` - CPF: ${data.witness1CPF}` : ''}`);
        if (data.witness2Name) addText(`2. ${data.witness2Name}${data.witness2CPF ? ` - CPF: ${data.witness2CPF}` : ''}`);
    }

    // Signatures
    y += 15;
    if (y > 240) {
        doc.addPage();
        y = 20;
    }

    doc.setFontSize(10);
    doc.text('_'.repeat(40), 20, y);
    doc.text('_'.repeat(40), pageWidth / 2 + 10, y);
    y += 5;
    doc.text('Locador', 20, y);
    doc.text('Locatário', pageWidth / 2 + 10, y);

    doc.save(`contrato_locacao_${data.startDate || 'documento'}.pdf`);
};

// ===== SALE CONTRACT =====

export interface SaleData {
    // Seller
    sellerName?: string;
    sellerCPF?: string;
    sellerRG?: string;
    sellerMaritalStatus?: string;
    sellerMarriageRegime?: string;
    sellerProfession?: string;
    sellerAddress?: string;

    // Buyer
    buyerName?: string;
    buyerCPF?: string;
    buyerRG?: string;
    buyerMaritalStatus?: string;
    buyerMarriageRegime?: string;
    buyerProfession?: string;
    buyerAddress?: string;

    // Property
    propertyAddress?: string;
    propertyRegistration?: string;
    propertySize?: string;
    propertyDescription?: string;
    propertyBoundaries?: string;

    // Payment
    totalAmount?: string;
    paymentMethod?: string;
    downPayment?: string;
    installments?: string;
    installmentAmount?: string;

    // Declarations
    debtsCleared?: boolean;
    noEncumbrances?: boolean;

    // Witnesses
    witness1Name?: string;
    witness1CPF?: string;
    witness2Name?: string;
    witness2CPF?: string;
}

export const generateSalePDF = (data: SaleData) => {
    const doc = new jsPDF();
    let y = 20;
    const lineHeight = 7;
    const pageWidth = doc.internal.pageSize.getWidth();

    const addText = (text: string, fontSize = 11, isBold = false) => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        doc.text(text, 20, y);
        y += lineHeight;
    };

    const addSection = (title: string) => {
        y += 3;
        addText(title, 12, true);
        y += 2;
    };

    // Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('CONTRATO DE COMPRA E VENDA DE IMÓVEL', pageWidth / 2, y, { align: 'center' });
    y += 15;

    // Seller
    addSection('VENDEDOR');
    if (data.sellerName) addText(`Nome: ${data.sellerName}`);
    if (data.sellerCPF) addText(`CPF: ${data.sellerCPF}`);
    if (data.sellerRG) addText(`RG: ${data.sellerRG}`);
    if (data.sellerMaritalStatus) addText(`Estado Civil: ${data.sellerMaritalStatus}`);
    if (data.sellerMarriageRegime) addText(`Regime de Bens: ${data.sellerMarriageRegime}`);
    if (data.sellerProfession) addText(`Profissão: ${data.sellerProfession}`);
    if (data.sellerAddress) addText(`Endereço: ${data.sellerAddress}`);

    // Buyer
    addSection('COMPRADOR');
    if (data.buyerName) addText(`Nome: ${data.buyerName}`);
    if (data.buyerCPF) addText(`CPF: ${data.buyerCPF}`);
    if (data.buyerRG) addText(`RG: ${data.buyerRG}`);
    if (data.buyerMaritalStatus) addText(`Estado Civil: ${data.buyerMaritalStatus}`);
    if (data.buyerMarriageRegime) addText(`Regime de Bens: ${data.buyerMarriageRegime}`);
    if (data.buyerProfession) addText(`Profissão: ${data.buyerProfession}`);
    if (data.buyerAddress) addText(`Endereço: ${data.buyerAddress}`);

    // Property
    addSection('IMÓVEL');
    if (data.propertyAddress) addText(`Endereço: ${data.propertyAddress}`);
    if (data.propertyRegistration) addText(`Matrícula: ${data.propertyRegistration}`);
    if (data.propertySize) addText(`Metragem: ${data.propertySize} m²`);
    if (data.propertyDescription) addText(`Descrição: ${data.propertyDescription}`);
    if (data.propertyBoundaries) {
        addText('Confrontações:');
        const lines = doc.splitTextToSize(data.propertyBoundaries, pageWidth - 40);
        lines.forEach((line: string) => addText(line));
    }

    // Payment
    addSection('CONDIÇÕES DE PAGAMENTO');
    if (data.totalAmount) addText(`Valor Total: R$ ${data.totalAmount}`);
    if (data.paymentMethod) addText(`Forma de Pagamento: ${data.paymentMethod}`);
    if (data.downPayment) addText(`Entrada: R$ ${data.downPayment}`);
    if (data.installments) addText(`Parcelas: ${data.installments}x`);
    if (data.installmentAmount) addText(`Valor da Parcela: R$ ${data.installmentAmount}`);

    // Declarations
    addSection('DECLARAÇÕES');
    if (data.debtsCleared) addText('✓ Imóvel livre de débitos (IPTU, condomínio, água, luz)');
    if (data.noEncumbrances) addText('✓ Imóvel livre de ônus e gravames');

    // Witnesses
    if (data.witness1Name || data.witness2Name) {
        addSection('TESTEMUNHAS');
        if (data.witness1Name) addText(`1. ${data.witness1Name}${data.witness1CPF ? ` - CPF: ${data.witness1CPF}` : ''}`);
        if (data.witness2Name) addText(`2. ${data.witness2Name}${data.witness2CPF ? ` - CPF: ${data.witness2CPF}` : ''}`);
    }

    // Signatures
    y += 15;
    if (y > 240) {
        doc.addPage();
        y = 20;
    }

    doc.setFontSize(10);
    doc.text('_'.repeat(40), 20, y);
    doc.text('_'.repeat(40), pageWidth / 2 + 10, y);
    y += 5;
    doc.text('Vendedor', 20, y);
    doc.text('Comprador', pageWidth / 2 + 10, y);

    doc.save(`contrato_compra_venda_${data.propertyAddress || 'documento'}.pdf`);
};


// ===== RECEIPT =====

export interface ReceiptData {
    // Payer
    payerName?: string;
    payerCPF?: string;
    payerAddress?: string;

    // Receiver
    receiverName?: string;
    receiverCPF?: string;
    receiverAddress?: string;

    // Payment
    amount?: string;
    description?: string;
    paymentDate?: string;
    paymentMethod?: string;

    // Signature
    signatureDataUrl?: string | null;
}

export const generateReceiptPDF = (data: ReceiptData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let y = 15;

    // ========== MODERN HEADER ==========
    // Gradient effect with two rectangles
    doc.setFillColor(255, 140, 0); // Orange
    doc.rect(0, 0, pageWidth, 22, 'F');
    doc.setFillColor(245, 120, 0); // Darker orange
    doc.rect(0, 22, pageWidth, 2, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('RECIBO DE PAGAMENTO', pageWidth / 2, 15, { align: 'center' });

    y = 30;
    doc.setTextColor(0, 0, 0);

    // ========== AMOUNT - COMPACT & HIGHLIGHTED ==========
    if (data.amount) {
        doc.setFillColor(255, 245, 230);
        doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'F');
        doc.setDrawColor(255, 140, 0);
        doc.setLineWidth(0.8);
        doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'S');

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 100, 0);
        doc.text(`Valor: R$ ${data.amount}`, pageWidth / 2, y + 12, { align: 'center' });
        doc.setTextColor(0, 0, 0);
        y += 22;
    }

    // ========== COMPACT SECTIONS ==========
    const addCompactSection = (title: string, fields: Array<{ label: string, value?: string }>) => {
        // Section header - thinner
        doc.setFillColor(245, 245, 245);
        doc.rect(margin, y, contentWidth, 6, 'F');
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(80, 80, 80);
        doc.text(title, margin + 3, y + 4.5);
        doc.setTextColor(0, 0, 0);
        y += 8;

        // Fields in two columns when possible
        const hasFields = fields.filter(f => f.value).length > 0;
        if (hasFields) {
            fields.forEach((field, index) => {
                if (field.value) {
                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'bold');
                    doc.text(field.label + ':', margin + 3, y);
                    doc.setFont('helvetica', 'normal');

                    // Wrap long text
                    const maxWidth = contentWidth - 40;
                    const lines = doc.splitTextToSize(field.value, maxWidth);
                    lines.forEach((line: string, i: number) => {
                        doc.text(line, margin + 35, y + (i * 4));
                    });
                    y += Math.max(4.5, lines.length * 4);
                }
            });
            y += 2;
        }
    };

    // Payer section
    if (data.payerName || data.payerCPF || data.payerAddress) {
        addCompactSection('DADOS DO PAGADOR', [
            { label: 'Nome', value: data.payerName },
            { label: 'CPF', value: data.payerCPF },
            { label: 'Endereço', value: data.payerAddress }
        ]);
    }

    // Receiver section
    if (data.receiverName || data.receiverCPF || data.receiverAddress) {
        addCompactSection('DADOS DO RECEBEDOR', [
            { label: 'Nome', value: data.receiverName },
            { label: 'CPF', value: data.receiverCPF },
            { label: 'Endereço', value: data.receiverAddress }
        ]);
    }

    // Payment details
    const paymentFields = [];
    if (data.description) paymentFields.push({ label: 'Referente a', value: data.description });
    if (data.paymentDate) paymentFields.push({ label: 'Data', value: data.paymentDate });
    if (data.paymentMethod) paymentFields.push({ label: 'Forma', value: data.paymentMethod });

    if (paymentFields.length > 0) {
        addCompactSection('DETALHES DO PAGAMENTO', paymentFields);
    }

    // ========== SIGNATURE - COMPACT ==========
    y += 3;

    doc.setFillColor(245, 245, 245);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text('ASSINATURA DO RECEBEDOR', margin + 3, y + 4.5);
    doc.setTextColor(0, 0, 0);
    y += 9;

    if (data.signatureDataUrl) {
        try {
            // Compact signature box
            const sigWidth = 70;
            const sigHeight = 25;
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.3);
            doc.rect(margin + 3, y, sigWidth, sigHeight, 'S');
            doc.addImage(data.signatureDataUrl, 'PNG', margin + 5, y + 2, sigWidth - 4, sigHeight - 4);

            // Name below signature
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text(data.receiverName || 'Nome do Recebedor', margin + 3 + (sigWidth / 2), y + sigHeight + 5, { align: 'center' });
            y += sigHeight + 8;
        } catch (e) {
            console.error('Error adding signature:', e);
            doc.setDrawColor(150, 150, 150);
            doc.line(margin + 3, y + 15, margin + 73, y + 15);
            doc.setFontSize(8);
            doc.text(data.receiverName || 'Nome do Recebedor', margin + 38, y + 20, { align: 'center' });
            y += 25;
        }
    } else {
        // Signature line
        doc.setDrawColor(150, 150, 150);
        doc.setLineWidth(0.5);
        doc.line(margin + 3, y + 15, margin + 73, y + 15);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(data.receiverName || 'Nome do Recebedor', margin + 38, y + 20, { align: 'center' });
        y += 25;
    }

    // ========== FOOTER ==========
    // Decorative bottom line
    doc.setDrawColor(255, 140, 0);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.setFont('helvetica', 'italic');
    doc.text('Documento gerado eletronicamente • DocPrint', pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Save with formatted filename
    const dateStr = data.paymentDate?.replace(/-/g, '') || new Date().toISOString().split('T')[0].replace(/-/g, '');
    doc.save(`recibo_${dateStr}.pdf`);
};
