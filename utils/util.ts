import { getPublicKey, nip19 } from "nostr-tools";
//import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import { decrypt, encrypt } from "nostr-tools/nip49";
import { storage } from "@wxt-dev/storage";
export const unixtimeRegex = /^\d{10}$/;
export const hexRegex = /^[0-9a-fA-F]{64}$/;
export const className = "nake";
export const encodableRegex =
  /^(((npub|nsec|nprofile|naddr|nevent|note)1[023456789acdefghjklmnpqrstuvwxyz]{58,}))$/; //|(nrelay1[023456789acdefghjklmnpqrstuvwxyz]{20,})
//export const encodableRegex = /^(nostr:){0,1}(((npub|nsec|nprofile|naddr|nevent|note)1[023456789acdefghjklmnpqrstuvwxyz]{58,})|(nrelay1[023456789acdefghjklmnpqrstuvwxyz]{20,}))$/;
export const nip33Regex = /^([0-9]{1,9}):([0-9a-fA-F]{64}):(.*)$/;
export const relayRegex = /^wss?:\/\/\S+$/;

export const nip49Regex = /^ncryptsec1[023456789acdefghjklmnpqrstuvwxyz]{58,}$/;

export interface Settings {
  showIconOnTextSelect: boolean;
  // showLocalTimeNumberSelect: boolean;
}
export const defaultSettings: Settings = {
  showIconOnTextSelect: true,
  //showLocalTimeNumberSelect: true,
  // 他の設定項目をここに追加
  //   darkMode: false, // 新しい設定項目
};

// 設定をロードする関数
export const loadSettings = async (): Promise<Settings | null> => {
  return await storage.getItem("local:appSettings");
};

export const nsecToNpub = (data: Uint8Array | undefined): string => {
  if (!data) {
    return "";
  }
  try {
    return nip19.npubEncode(getPublicKey(data));
  } catch (error) {
    return "";
  }
};

export const toNcryptsec = (array: Uint8Array, pass: string): string => {
  try {
    return encrypt(array, pass);
  } catch (error) {
    console.error("Encryption failed:", error);
    return "";
  }
};
