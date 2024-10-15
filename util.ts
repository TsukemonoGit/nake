export const hexRegex = /^[0-9a-fA-F]{64}$/;
export const className = "nake";
export const encodableRegex =
  /^(((npub|nsec|nprofile|naddr|nevent|note)1[023456789acdefghjklmnpqrstuvwxyz]{58,}))$/; //|(nrelay1[023456789acdefghjklmnpqrstuvwxyz]{20,})
//export const encodableRegex = /^(nostr:){0,1}(((npub|nsec|nprofile|naddr|nevent|note)1[023456789acdefghjklmnpqrstuvwxyz]{58,})|(nrelay1[023456789acdefghjklmnpqrstuvwxyz]{20,}))$/;
export const nip33Regex = /^([0-9]{1,9}):([0-9a-fA-F]{64}):(.*)$/;
export const relayRegex = /^wss?:\/\/\S+$/;

export interface Settings {
  showIconOnTextSelect: boolean;
}
export const defaultSettings: Settings = {
  showIconOnTextSelect: true,
  // 他の設定項目をここに追加
  //   darkMode: false, // 新しい設定項目
};

// 設定をロードする関数
export const loadSettings = async (): Promise<Settings | null> => {
  return await storage.getItem("local:appSettings");
};
