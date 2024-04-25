"use client";
import { Autocomplete, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

interface AutoCompleteProps<T> {
  control: any;
  options: T[];
  name: string;
  labelIdentifier: keyof T;
  valueIdentifier: keyof T;
  defaultValueId?: string;
  fieldLabel: string;
  required?: boolean;
}

export default function AutoComplete<T>({
  control,
  options,
  name,
  labelIdentifier,
  valueIdentifier,
  fieldLabel,
  defaultValueId,
  required = true,
}: AutoCompleteProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: "required field",
      }}
      render={({ field, fieldState: { error } }) => {
        const { value, onChange, ref } = field;
        return (
          <Autocomplete
            defaultValue={options.find(
              (option: any) => option[valueIdentifier] === defaultValueId
            )}
            getOptionLabel={(option) => `${option[labelIdentifier]}`}
            options={options}
            value={
              value
                ? options.find(
                    (option: any) => option[valueIdentifier] === value
                  ) ?? null
                : null
            }
            onChange={(event: any, newValue) => {
              onChange(newValue ? newValue[valueIdentifier] : null);
            }}
            renderInput={(params) => (
              <TextField
                //  InputLabelProps={{required}}
                required={required}
                {...params}
                label={fieldLabel}
                inputRef={ref}
                helperText={error?.message}
                error={!!error}
              />
            )}
          />
        );
      }}
    />
  );
}
