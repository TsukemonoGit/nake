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

      // neventの場合は元のkindとauthorも取得
      const originalData = decoded()?.data as nip19.EventPointer;

      return nip19.neventEncode({
        id: id,
        relays: relayHints(),
        // kindとauthorが存在する場合は含める
        ...(originalData?.kind !== undefined && { kind: originalData.kind }),
        ...(originalData?.author && { author: originalData.author }),
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
              <Show
                when={
                  (decoded()?.data as nip19.EventPointer).kind !== undefined
                }
              >
                <Content
                  content={
                    (decoded()?.data as nip19.EventPointer)?.kind?.toString() ??
                    ""
                  }
                  title={"kind"}
                  link={false}
                />
              </Show>
              <Show when={(decoded()?.data as nip19.EventPointer).author}>
                <Content
                  content={
                    (decoded()?.data as nip19.EventPointer)?.author ?? ""
                  }
                  title={"author"}
                  link={false}
                />
              </Show>
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
              <hr />
              <Content content={nevent} title={"nevent"} />
            </>
          </Match>
        </Switch>
      </Show>
    </>
  );
}
