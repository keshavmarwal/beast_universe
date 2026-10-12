import { useMemo, useState } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import land110 from "world-atlas/land-110m.json";

const W = 960;
const H = 500;

// SAMPLE DATA: concept ke liye placeholder. Real numbers daalne hon to sourced hi daalna.
const PROJECTS = [
  { id: "ke", place: "Kenya", lng: 37.9, lat: 0.2, title: "Clean water wells", stat: "12 wells", detail: "Fresh drinking water for villages that walked miles for it." },
  { id: "hn", place: "Honduras", lng: -86.2, lat: 14.8, title: "Homes for families", stat: "20 homes", detail: "Safe, solid homes built together with the local community." },
  { id: "ph", place: "Philippines", lng: 122.0, lat: 12.9, title: "Meal programs", stat: "50,000 meals", detail: "Hot meals for kids and families after the typhoon season." },
  { id: "in", place: "India", lng: 78.9, lat: 22.0, title: "Classroom upgrades", stat: "15 schools", detail: "New desks, books and clean toilets for rural schools." },
  { id: "br", place: "Brazil", lng: -51.9, lat: -14.2, title: "Tree planting", stat: "10,000 trees", detail: "Replanting native trees to bring back damaged forest." },
  { id: "gh", place: "Ghana", lng: -1.0, lat: 7.9, title: "Medical camps", stat: "8 camps", detail: "Free check-ups and medicine for people far from a clinic." },
];

export default function ImpactMap() {
  const [active, setActive] = useState(PROJECTS[0]);

  const { d, pins } = useMemo(() => {
    const geo = feature(land110, land110.objects.land);
    const projection = geoNaturalEarth1().fitSize([W, H], geo);
    return {
      d: geoPath(projection)(geo),
      pins: PROJECTS.map((p) => ({ ...p, xy: projection([p.lng, p.lat]) })),
    };
  }, []);

  const select = (p) => setActive(PROJECTS.find((x) => x.id === p.id));

  return (
    <div className="impact">
      <div className="map-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Map of sample impact projects">
          <path className="land" d={d} />
          {pins.map((p) => (
            <g
              key={p.id}
              className={`pin ${p.id === active.id ? "on" : ""}`}
              transform={`translate(${p.xy[0]} ${p.xy[1]})`}
              role="button"
              tabIndex={0}
              aria-label={`${p.place}: ${p.title}`}
              onClick={() => select(p)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  select(p);
                }
              }}
            >
              <circle r="18" fill="transparent" />
              <circle className="ring" r="10" />
              <circle className="dot" r="6" />
            </g>
          ))}
        </svg>
      </div>

      <div className="impact-card" key={active.id}>
        <p className="impact-place">{active.place}</p>
        <h3>{active.title}</h3>
        <p className="impact-stat">{active.stat}</p>
        <p>{active.detail}</p>
        <p className="impact-note">Sample data for this fan concept, not real figures.</p>
      </div>

      <div className="chips" role="group" aria-label="Projects">
        {PROJECTS.map((p) => (
          <button
            key={p.id}
            className={`chip ${p.id === active.id ? "on" : ""}`}
            aria-pressed={p.id === active.id}
            onClick={() => setActive(p)}
          >
            {p.place}
          </button>
        ))}
      </div>
    </div>
  );
}