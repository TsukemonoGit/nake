import { nip19 } from "nostr-tools";
import { Accessor, Match, Show, Switch, createMemo } from "solid-js";
import CopyButton from "./CopyButton";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import { className } from "@/util";

export default function DecodableContent({ content }: { content: string }) {
  const decoded: Accessor<nip19.DecodeResult | null> = createMemo(() => {
    try {
      console.log(nip19.decode(content).type);
      return nip19.decode(content);
    } catch (error) {
      return null;
    }
  });
  return (
    <>
      <Show when={decoded() !== null}>
        <span class={className} style={{ "font-weight": "bold" }}>
          type:{decoded()?.type}
        </span>
        <Switch fallback={<div>Not Found</div>}>
          <Match when={decoded()?.type === "nprofile"}>
            <>
              <div class={className} style={{ margin: "6px 0" }}>
                <span class={className} style={{ "font-weight": "bold" }}>
                  [id]
                </span>
                <CopyButton
                  text={(decoded()?.data as nip19.ProfilePointer).pubkey}
                />
              </div>
              <Show when={(decoded()?.data as nip19.ProfilePointer)?.relays}>
                <div class={className} style={{ margin: "6px 0" }}>
                  <span class={className} style={{ "font-weight": "bold" }}>
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
              {/* <span class={className}>[npub]</span> */}
              <CopyButton
                style={{ margin: "6px 0" }}
                text={nip19.npubEncode(
                  (decoded()?.data as nip19.ProfilePointer).pubkey
                )}
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
              <div class={className} style={{ margin: "6px 0" }}>
                <span class={className} style={{ "font-weight": "bold" }}>
                  [id]
                </span>
                <CopyButton text={(decoded()?.data as nip19.EventPointer).id} />
              </div>
              <Show when={(decoded()?.data as nip19.EventPointer).relays}>
                <div class={className} style={{ margin: "6px 0" }}>
                  <span class={className} style={{ "font-weight": "bold" }}>
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
                <div class={className} style={{ margin: "6px 0" }}>
                  <span class={className} style={{ "font-weight": "bold" }}>
                    [kind]
                  </span>
                  <CopyButton
                    text={
                      (
                        decoded()?.data as nip19.EventPointer
                      )?.kind?.toString() ?? ""
                    }
                  />
                </div>
              </Show>
              <Show when={(decoded()?.data as nip19.EventPointer).author}>
                <div class={className} style={{ margin: "6px 0" }}>
                  <span class={className} style={{ "font-weight": "bold" }}>
                    [author]
                  </span>
                  <CopyButton
                    text={(decoded()?.data as nip19.EventPointer)?.author ?? ""}
                  />
                </div>
              </Show>
              <hr />
              <CopyButton
                text={nip19.noteEncode(
                  (decoded()?.data as nip19.EventPointer).id
                )}
              />
            </>
          </Match>
          <Match when={decoded()?.type === "naddr"}>
            <>
              <div class={className} style={{ margin: "6px 0" }}>
                <span class={className} style={{ "font-weight": "bold" }}>
                  [identifier]
                </span>
                <CopyButton
                  text={(decoded()?.data as nip19.AddressPointer).identifier}
                />
              </div>
              <div class={className} style={{ margin: "6px 0" }}>
                <span class={className} style={{ "font-weight": "bold" }}>
                  [kind]
                </span>
                <CopyButton
                  text={(
                    decoded()?.data as nip19.AddressPointer
                  ).kind.toString()}
                />
              </div>
              <div class={className} style={{ margin: "6px 0" }}>
                <span class={className} style={{ "font-weight": "bold" }}>
                  [pubkey]
                </span>
                <CopyButton
                  text={(decoded()?.data as nip19.AddressPointer).pubkey}
                />
              </div>

              <Show when={(decoded()?.data as nip19.AddressPointer).relays}>
                <div class={className} style={{ margin: "6px 0" }}>
                  <span class={className} style={{ "font-weight": "bold" }}>
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
            </>
          </Match>
          <Match when={decoded()?.type === "nsec"}>
            <>
              <CopyButton
                style={{ margin: "6px 0" }}
                text={(decoded()?.data as Uint8Array).toString()}
              />
              <CopyButton
                style={{ margin: "6px 0" }}
                text={bytesToHex(decoded()?.data as Uint8Array)}
              />
            </>
          </Match>
          <Match when={decoded()?.type === "npub"}>
            <>
              <CopyButton
                style={{ margin: "6px 0" }}
                text={decoded()?.data as string}
              />
              <CopyButton
                style={{ margin: "6px 0" }}
                text={nip19.nprofileEncode({
                  pubkey: decoded()?.data as string,
                })}
              />
            </>
          </Match>
          <Match when={decoded()?.type === "note"}>
            <>
              <CopyButton
                style={{ margin: "6px 0" }}
                text={decoded()?.data as string}
              />{" "}
              <CopyButton
                style={{ margin: "6px 0" }}
                text={nip19.neventEncode({ id: decoded()?.data as string })}
              />
            </>
          </Match>
        </Switch>
      </Show>
    </>
  );
}
