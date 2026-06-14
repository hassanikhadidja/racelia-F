export function createCtaDock({
  sectionId = "ctaDock",
  slotId = "ctaDockSlot",
  actionSlotId = null,
} = {}) {
  const section = document.createElement("section");
  section.className = actionSlotId ? "cta-dock cta-dock--pdp" : "cta-dock";
  section.id = sectionId;

  if (actionSlotId) {
    const actionSlot = document.createElement("div");
    actionSlot.className = "cta-dock__action-slot";
    actionSlot.id = actionSlotId;
    section.appendChild(actionSlot);
  }

  const slot = document.createElement("div");
  slot.className = "cta-dock__slot";
  slot.id = slotId;

  section.appendChild(slot);
  return section;
}
