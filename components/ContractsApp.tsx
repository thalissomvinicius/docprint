import React, { useState } from 'react';
import { ContractsView } from './ContractsView';
import { InspectionForm } from './contracts/InspectionForm';
import { RentalForm } from './contracts/RentalForm';
import { SaleForm } from './contracts/SaleForm';

interface ContractsAppProps {
    onBack: () => void;
}

export const ContractsApp: React.FC<ContractsAppProps> = ({ onBack }) => {
    const [selectedContract, setSelectedContract] = useState<'inspection' | 'rental' | 'sale' | null>(null);

    const handleSelectContract = (type: 'inspection' | 'rental' | 'sale') => {
        setSelectedContract(type);
    };

    const handleBack = () => {
        if (selectedContract) {
            setSelectedContract(null);
        } else {
            onBack();
        }
    };

    return (
        <div className="w-full h-full">
            {!selectedContract && (
                <ContractsView onSelectContract={handleSelectContract} onBack={onBack} />
            )}

            {selectedContract === 'inspection' && (
                <InspectionForm onBack={handleBack} />
            )}

            {selectedContract === 'rental' && (
                <RentalForm onBack={handleBack} />
            )}

            {selectedContract === 'sale' && (
                <SaleForm onBack={handleBack} />
            )}
        </div>
    );
};
