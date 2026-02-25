export interface SystemConfig {
  id: number;
  key: string;
  value: string;
  description: string;
  updatedAt: string;
}

export interface UpdateConfigPayload {
  value: string;
  description: string;
}

export interface ConfigTableProps {
  configs: SystemConfig[];
  onEdit: (config: SystemConfig) => void;
}