import { getTranslations } from "next-intl/server";
import { PhotoBoard } from "@/components/cottage/PhotoBoard";
import { groupByLevel, type Room } from "@/components/cottage/room-levels";
import { PhotoViewer } from "@/components/shared/PhotoViewer";
import { mediaOf } from "@/components/shared/viewer-photos";

interface RoomTourProps {
  rooms: Room[];
}

const ROOM_PHOTO = "(min-width: 90rem) 464px, (min-width: 64rem) 32vw, 46vw";

export async function RoomTour({ rooms }: RoomTourProps) {
  const t = await getTranslations("cottage");
  const levels = groupByLevel(rooms);

  return (
    <div className="visite page section-serree">
      <nav className="parcours" aria-labelledby="titre-plan">
        <h2 id="titre-plan">{t("visitTitle")}</h2>
        <ol>
          {levels.map(({ level, anchor, rooms: levelRooms }) => (
            <li key={level}>
              <a href={`#${anchor}`}>{t(`levels.${level}`)}</a>
              <ol>
                {levelRooms.map(({ room, anchor: roomAnchor }) => (
                  <li key={roomAnchor}>
                    <a href={`#${roomAnchor}`}>{room.name}</a>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      </nav>

      <PhotoViewer>
        <div className="grid gap-y-24">
          {levels.map(({ level, anchor, rooms: levelRooms }) => (
            <section
              key={level}
              id={anchor}
              className="niveau"
              aria-labelledby={`titre-${anchor}`}
            >
              <h2 id={`titre-${anchor}`} className="palier">
                {t(`levels.${level}`)}
                <small>{t("roomCount", { count: levelRooms.length })}</small>
              </h2>

              {levelRooms.map(({ room, anchor: roomAnchor }) => {
                const photos = mediaOf(room.photos);

                return (
                  <article key={roomAnchor} id={roomAnchor} className="piece">
                    <h3>{room.name}</h3>
                    {room.details && <p className="couchage">{room.details}</p>}
                    {room.description && <p>{room.description}</p>}
                    <PhotoBoard photos={photos} sizes={ROOM_PHOTO} />
                  </article>
                );
              })}
            </section>
          ))}
        </div>
      </PhotoViewer>
    </div>
  );
}
