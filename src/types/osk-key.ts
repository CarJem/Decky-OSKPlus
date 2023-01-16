export interface OSK_Key
{
    isCustom?: boolean;
    key: string;
    label: any;
    type: number;
}


export type OSK_KeyLayout =
  | string
  | OSK_Key
  | null
  | Array<OSK_Key | string | null>;
