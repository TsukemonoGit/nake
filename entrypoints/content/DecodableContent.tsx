import { nip19 } from "nostr-tools";
import { Accessor, Match, Show, Switch, createMemo } from "solid-js";
import CopyButton from "./CopyButton";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import { className } from "@/util";
import Content from "./Content";

export default function DecodableContent({ content }: { content: string }) {
  const decoded: Accessor<nip19.DecodeResult | null> = createMemo(() => {
    try {
      // console.log(nip19.decode(content).type);
      return nip19.decode(content);
    } catch (error) {
      return null;
    }
  });
  return (
    <>
      <Show when={decoded() !== null}>
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
                title={"id"}
              />
              <Show when={(decoded()?.data as nip19.ProfilePointer)?.relays}>
                <div class={className} style={{ margin: "6px 0" }}>
                  <span
                    class={className}
                    style={{ "font-weight": "bold", "font-size": "smaller" }}
                  >
                    [relays]
                  </span>
                  <CopyButton
                    text={
                      (decoded()?.data as nip19.ProfilePointer)?.relays?.join(
                        ", "
                      ) || "no data"
                    }
                  />
                </div>
              </Show>
              <hr />
              <Content
                content={nip19.npubEncode(
                  (decoded()?.data as nip19.ProfilePointer).pubkey
                )}
                title={"npub"}
              />
            </>
          </Match>
          <Match when={decoded()?.type === "nrelay"}>
            <>
              <CopyButton text={decoded()?.data as string} />
            </>
          </Match>
          <Match when={decoded()?.type === "nevent"}>
            <>
              <Content
                content={(decoded()?.data as nip19.EventPointer).id}
                title={"id"}
              />

              <Show when={(decoded()?.data as nip19.EventPointer).relays}>
                <div class={className} style={{ margin: "6px 0" }}>
                  <span
                    class={className}
                    style={{ "font-weight": "bold", "font-size": "smaller" }}
                  >
                    [relays]
                  </span>
                  <CopyButton
                    text={
                      (decoded()?.data as nip19.EventPointer)?.relays?.join(
                        ", "
                      ) || "no data"
                    }
                  />
                </div>
              </Show>
              <Show when={(decoded()?.data as nip19.EventPointer).kind}>
                <Content
                  content={
                    (decoded()?.data as nip19.EventPointer)?.kind?.toString() ??
                    ""
                  }
                  title={"kind"}
                />
              </Show>
              <Show when={(decoded()?.data as nip19.EventPointer).author}>
                <Content
                  content={
                    (decoded()?.data as nip19.EventPointer)?.author ?? ""
                  }
                  title={"author"}
                />
              </Show>
              <hr />
              <Content
                content={nip19.noteEncode(
                  (decoded()?.data as nip19.EventPointer).id
                )}
              />
            </>
          </Match>
          <Match when={decoded()?.type === "naddr"}>
            <>
              <Content
                content={(decoded()?.data as nip19.AddressPointer).identifier}
                title={"identifier"}
              />
              <Content
                content={(
                  decoded()?.data as nip19.AddressPointer
                ).kind.toString()}
                title={"kind"}
              />
              <Content
                content={(decoded()?.data as nip19.AddressPointer).pubkey}
                title={"pubkey"}
              />

              <Show when={(decoded()?.data as nip19.AddressPointer).relays}>
                <div class={className} style={{ margin: "6px 0" }}>
                  <span
                    class={className}
                    style={{ "font-weight": "bold", "font-size": "smaller" }}
                  >
                    [relays]
                  </span>
                  <CopyButton
                    text={
                      (decoded()?.data as nip19.AddressPointer)?.relays?.join(
                        ", "
                      ) || "no data"
                    }
                  />
                </div>
              </Show>
              <Content
                content={`${(
                  decoded()?.data as nip19.AddressPointer
                ).kind.toString()}:${
                  (decoded()?.data as nip19.AddressPointer).pubkey
                }:${(decoded()?.data as nip19.AddressPointer).identifier}`}
                title={"'a' tag"}
              />
            </>
          </Match>
          <Match when={decoded()?.type === "nsec"}>
            <>
              <Content
                content={(decoded()?.data as Uint8Array).toString()}
                title={"Uint8Array"}
              />
              <Content content={bytesToHex(decoded()?.data as Uint8Array)} />
            </>
          </Match>
          <Match when={decoded()?.type === "npub"}>
            <>
              <Content content={decoded()?.data as string} />
              <Content
                content={nip19.nprofileEncode({
                  pubkey: decoded()?.data as string,
                })}
                title={"nprofile"}
              />
            </>
          </Match>
          <Match when={decoded()?.type === "note"}>
            <>
              <Content content={decoded()?.data as string} />
              <Content
                content={nip19.neventEncode({ id: decoded()?.data as string })}
                title={"nevent"}
              />
            </>
          </Match>
        </Switch>
      </Show>
    </>
  );
}
