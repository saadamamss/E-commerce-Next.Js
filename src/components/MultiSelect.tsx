"use client";
import { useEffect, useState } from "react";
import Select from "react-select";
import { ActionMeta, OnChangeValue } from "react-select";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  onChange: (
    newValue: OnChangeValue<Option, true>,
    actionMeta: ActionMeta<Option>
  ) => void;
  defaultValue: any
}

export default function MultiSelect({ options, onChange , defaultValue }: MultiSelectProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      {isClient && (
        <Select
          isMulti
          name="brands"
          options={options}
          className="basic-multi-select"
          classNamePrefix="select"
          getOptionValue={(option) => option.value}
          getOptionLabel={(option) => option.label}
          onChange={onChange}
          defaultValue={defaultValue}
        />
      )}
    </>
  );
}
