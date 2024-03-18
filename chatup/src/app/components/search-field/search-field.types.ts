export interface SearchFieldProps {
  id: string;
  name: string;
  placeholder: string;
  setParamToSearch?: (search: string) => void;
}
