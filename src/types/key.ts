export interface KeyDefinition {
    key: string;
    label: any;
    type: number;
}

export interface KeyMapping {
    definition: KeyDefinition;
    row: number;
    offset: number;
}