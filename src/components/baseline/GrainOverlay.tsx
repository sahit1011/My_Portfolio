// Static film-grain overlay — kills color banding on the near-black canvas
// and adds tactile depth. Pure CSS, no JS cost. (.grain defined in globals.css)
export default function GrainOverlay() {
  return <div className="grain" aria-hidden="true" />;
}
