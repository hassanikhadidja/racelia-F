export function createHomeStories() {
  const section = document.createElement("nav");
  section.className = "home-stories";
  section.id = "homeStories";
  section.setAttribute("aria-label", "Parcourir");
  section.setAttribute("data-i18n-aria", "home.stories.aria");

  const track = document.createElement("div");
  track.className = "home-stories__track";
  track.id = "homeStoriesTrack";
  section.appendChild(track);
  return section;
}
