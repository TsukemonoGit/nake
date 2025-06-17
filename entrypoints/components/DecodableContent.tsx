import { nip19 } from "nostr-tools";
import {
  Accessor,
  Match,
  Show,
  Switch,
  createMemo,
  createSignal,
} from "solid-js";
import { className } from "@/utils/util";
import Content from "./Content";
import {
  ProfilePointer,
  EventPointer,
  AddressPointer,
} from "nostr-tools/nip19";
import RelayHints from "./RelayHints";
import EncodedNsec from "./EncodedNsec";

export default function DecodableContent({ content }: { content: string }) {
  const decoded: Accessor<nip19.DecodedResult | null> = createMemo(() => {
    try {
      // console.log(nip19.decode(content).type);
      return nip19.decode(content);
    } catch (error) {
      return null;
    }
  });
  const [relayHints, setRelayHints] = createSignal<string[]>(
    (decoded()?.data as ProfilePointer | EventPointer | AddressPointer)
      ?.relays ?? []
  );

  // nevent用のkindとauthorの編集可能state
  const [eventKind, setEventKind] = createSignal<number | undefined>(
    decoded()?.type === "nevent" || decoded()?.type === "note"
      ? (decoded()?.data as EventPointer)?.kind
      : undefined
  );
  const [eventAuthor, setEventAuthor] = createSignal<string>(
    decoded()?.type === "nevent" || decoded()?.type === "note"
      ? (decoded()?.data as EventPointer)?.author ?? ""
      : ""
  );

  // authorをnpub形式で表示するための変換関数
  const authorAsNpub = createMemo(() => {
    const author = eventAuthor();
    if (!author) return "";
    try {
      return nip19.npubEncode(author);
    } catch {
      return author; // 変換に失敗した場合は元の値を返す
    }
  });

  // npub入力をhexに変換する関数
  const handleAuthorInput = (value: string) => {
    if (!value) {
      setEventAuthor("");
      return;
    }

    try {
      // npubの場合はhexに変換
      if (value.startsWith("npub")) {
        const decoded = nip19.decode(value);
        if (decoded.type === "npub") {
          setEventAuthor(decoded.data as string);
        }
      } else {
        // hex形式の場合はそのまま使用（64文字の16進数かチェック）
        if (/^[0-9a-fA-F]{64}$/.test(value)) {
          setEventAuthor(value);
        } else {
          // 不正な形式の場合は現在の値を保持
          return;
        }
      }
    } catch {
      // デコードに失敗した場合は何もしない
      return;
    }
  };

  const nprofile = createMemo(() => {
    if (decoded()?.type === "nprofile" || decoded()?.type === "npub") {
      const pubkey =
        decoded()?.type === "nprofile"
          ? (decoded()?.data as nip19.ProfilePointer).pubkey
          : (decoded()?.data as string);

      return nip19.nprofileEncode({
        pubkey: pubkey,
        relays: relayHints(),
      });
    } else {
      return "";
    }
  });

  const nevent = createMemo(() => {
    if (decoded()?.type === "nevent" || decoded()?.type === "note") {
      const id =
        decoded()?.type === "nevent"
          ? (decoded()?.data as nip19.EventPointer).id
          : (decoded()?.data as string);

      return nip19.neventEncode({
        id: id,
        relays: relayHints(),
        // 編集可能なkindとauthorを使用
        ...(eventKind() !== undefined && { kind: eventKind()! }),
        ...(eventAuthor() && { author: eventAuthor() }),
      });
    } else {
      return "";
    }
  });

  const naddr = createMemo(() => {
    if (decoded()?.type === "naddr") {
      const addr = decoded()?.data as nip19.AddressPointer;
      return nip19.naddrEncode({
        identifier: addr.identifier,
        kind: addr.kind,
        pubkey: addr.pubkey,
        relays: relayHints(),
      });
    } else {
      return "";
    }
  });

  return (
    <>
      <Show when={decoded() !== null} fallback={"failed to decode"}>
        <span
          class={className}
          style={{ "font-weight": "bold", "font-size": "smaller" }}
        >
          type:{decoded()?.type}
        </span>
        <Switch fallback={<div>Not Found</div>}>
          <Match when={decoded()?.type === "nprofile"}>
            <>
              <Content
                content={(decoded()?.data as nip19.ProfilePointer).pubkey}
                title={"hex"}
                link={false}
              />
              <RelayHints
                setRelayHints={setRelayHints}
                relayHints={relayHints}
              />

              {/* 編集可能なkind (noteの場合は追加) */}
              <div class={className} style={{ margin: "6px 0" }}>
                <span
                  class={className}
                  style={{ "font-weight": "bold", "font-size": "smaller" }}
                >
                  kind:
                </span>
                <input
                  type="number"
                  value={eventKind() ?? ""}
                  onInput={(e) => {
                    const value = e.currentTarget.value;
                    setEventKind(value === "" ? undefined : parseInt(value));
                  }}
                  placeholder="kind (optional)"
                  style={{ margin: "0 6px", padding: "2px 4px", width: "80px" }}
                />
              </div>

              {/* 編集可能なauthor (npub表記) */}
              <div class={className} style={{ margin: "6px 0" }}>
                <span
                  class={className}
                  style={{ "font-weight": "bold", "font-size": "smaller" }}
                >
                  author:
                </span>
                <input
                  type="text"
                  value={authorAsNpub()}
                  onInput={(e) => handleAuthorInput(e.currentTarget.value)}
                  placeholder="author npub (optional)"
                  style={{
                    margin: "0 6px",
                    padding: "2px 4px",
                    width: "400px",
                    "font-family": "monospace",
                    "font-size": "smaller",
                  }}
                />
              </div>
              <hr />

              <Content
                content={nip19.npubEncode(
                  (decoded()?.data as nip19.ProfilePointer).pubkey
                )}
                title={"npub"}
              />
              <Content content={nprofile} title={"nprofile"} />
            </>
          </Match>

          <Match when={decoded()?.type === "nevent"}>
            <>
              <Content
                content={(decoded()?.data as nip19.EventPointer).id}
                title={"hex"}
                link={false}
              />

              <RelayHints
                setRelayHints={setRelayHints}
                relayHints={relayHints}
              />

              {/* 編集可能なkind */}
              <div class={className} style={{ margin: "6px 0" }}>
                <span
                  class={className}
                  style={{ "font-weight": "bold", "font-size": "smaller" }}
                >
                  kind:
                </span>
                <input
                  type="number"
                  value={eventKind() ?? ""}
                  onInput={(e) => {
                    const value = e.currentTarget.value;
                    setEventKind(value === "" ? undefined : parseInt(value));
                  }}
                  placeholder="kind (optional)"
                  style={{ margin: "0 6px", padding: "2px 4px", width: "80px" }}
                />
              </div>

              {/* 編集可能なauthor (npub表記) */}
              <div class={className} style={{ margin: "6px 0" }}>
                <span
                  class={className}
                  style={{ "font-weight": "bold", "font-size": "smaller" }}
                >
                  author:
                </span>
                <input
                  type="text"
                  value={authorAsNpub()}
                  onInput={(e) => handleAuthorInput(e.currentTarget.value)}
                  placeholder="author npub (optional)"
                  style={{
                    margin: "0 6px",
                    padding: "2px 4px",
                    width: "400px",
                    "font-family": "monospace",
                    "font-size": "smaller",
                  }}
                />
              </div>
              <hr />
              <Content
                content={nip19.noteEncode(
                  (decoded()?.data as nip19.EventPointer).id
                )}
                title={"note"}
              />
              <Content content={nevent} title={"nevent"} />
            </>
          </Match>

          <Match when={decoded()?.type === "naddr"}>
            <>
              <Content
                content={(decoded()?.data as nip19.AddressPointer).identifier}
                title={"identifier"}
                link={false}
              />
              <Content
                content={(
                  decoded()?.data as nip19.AddressPointer
                ).kind.toString()}
                title={"kind"}
                link={false}
              />
              <Content
                content={(decoded()?.data as nip19.AddressPointer).pubkey}
                title={"pubkey"}
                link={false}
              />

              <RelayHints
                setRelayHints={setRelayHints}
                relayHints={relayHints}
              />
              <Content
                content={`${(
                  decoded()?.data as nip19.AddressPointer
                ).kind.toString()}:${
                  (decoded()?.data as nip19.AddressPointer).pubkey
                }:${(decoded()?.data as nip19.AddressPointer).identifier}`}
                title={"'a' tag"}
                link={false}
              />
              <hr />
              <Content content={naddr} title={"naddr"} />
            </>
          </Match>

          <Match when={decoded()?.type === "nsec"}>
            <EncodedNsec array={decoded()?.data as Uint8Array} />
          </Match>

          <Match when={decoded()?.type === "npub"}>
            <>
              <Content
                content={decoded()?.data as string}
                title={"hex"}
                link={false}
              />
              <RelayHints
                setRelayHints={setRelayHints}
                relayHints={relayHints}
              />
              <hr />
              <Content content={nprofile} title={"nprofile"} />
            </>
          </Match>

          <Match when={decoded()?.type === "note"}>
            <>
              <Content
                content={decoded()?.data as string}
                title={"hex"}
                link={false}
              />
              <RelayHints
                setRelayHints={setRelayHints}
                relayHints={relayHints}
              />

              {/* 編集可能なkind */}
              <div class={className} style={{ margin: "6px 0" }}>
                <span
                  class={className}
                  style={{ "font-weight": "bold", "font-size": "smaller" }}
                >
                  kind:
                </span>
                <input
                  type="number"
                  value={eventKind() ?? ""}
                  onInput={(e) => {
                    const value = e.currentTarget.value;
                    setEventKind(value === "" ? undefined : parseInt(value));
                  }}
                  placeholder="kind (optional)"
                  style={{ margin: "0 6px", padding: "2px 4px", width: "80px" }}
                />
              </div>

              {/* 編集可能なauthor (npub表記) */}
              <div class={className} style={{ margin: "6px 0" }}>
                <span
                  class={className}
                  style={{ "font-weight": "bold", "font-size": "smaller" }}
                >
                  author:
                </span>
                <input
                  type="text"
                  value={authorAsNpub()}
                  onInput={(e) => handleAuthorInput(e.currentTarget.value)}
                  placeholder="author npub (optional)"
                  style={{
                    margin: "0 6px",
                    padding: "2px 4px",
                    width: "400px",
                    "font-family": "monospace",
                    "font-size": "smaller",
                  }}
                />
              </div>
              <hr />
              <Content content={nevent} title={"nevent"} />
            </>
          </Match>
        </Switch>
      </Show>
    </>
  );
}
