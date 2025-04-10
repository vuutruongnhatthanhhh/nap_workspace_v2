import { memo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FieldInputProps {
  label: string;
  value: string;
  required?: boolean;
  onChange: (val: string) => void;
}

const FieldInput = memo(
  ({ label, value, required, onChange }: FieldInputProps) => {
    return (
      <div>
        <Label className="mb-2">
          {label}
          {required && <span className="text-red-600">*</span>}
        </Label>
        <input value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }
);

export default FieldInput;
