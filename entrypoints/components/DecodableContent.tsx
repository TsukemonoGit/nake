import { nip19 } from "nostr-tools";
import {
  Accessor,
  Match,
  Show,
  Switch,
  createMemo,
  createSignal,
} from "solid-js";
import CopyButton from "./CopyButton";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import { className } from "@/util";
import Content from "./Content";
import {
  ProfilePointer,
  EventPointer,
  AddressPointer,
} from "nostr-tools/nip19";
import RelayHints from "./RelayHints";

export default function DecodableContent({ content }: { content: string }) {
  const decoded: Accessor<nip19.DecodeResult | null> = createMemo(() => {
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
              {/* <Show when={(decoded()?.data as nip19.ProfilePointer)?.relays}>
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
              </Show> */}
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
          <Match when={decoded()?.type === "nrelay"}>
            <>
              <CopyButton text={decoded()?.data as string} />
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
              <Content content={nevent} />
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
            <>
              <Content
                content={(decoded()?.data as Uint8Array).toString()}
                title={"Uint8Array"}
                link={false}
              />
              <Content
                content={bytesToHex(decoded()?.data as Uint8Array)}
                title={"hex"}
                link={false}
              />
            </>
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
              <hr />
              <Content content={nevent} title={"nevent"} />
            </>
          </Match>
        </Switch>
      </Show>
    </>
  );
}
