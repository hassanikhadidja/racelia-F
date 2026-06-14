export function getDashboardAccountOverlaysMarkup() {
  return `
  <div class="dashboard-sheet-overlay" id="dashboard-profile-overlay" aria-hidden="true">
    <div class="dashboard-sheet profile-sheet" role="dialog" aria-labelledby="dashboard-profile-title">
      <div class="dashboard-sheet-header">
        <h3 id="dashboard-profile-title">My profile</h3>
        <button type="button" class="dashboard-sheet-close" data-close="dashboard-profile-overlay">Close</button>
      </div>
      <div class="dashboard-profile-body">
        <div class="dashboard-profile-avatar-wrap" id="dashboard-profile-avatar-wrap">
          <div class="dashboard-profile-avatar" id="dashboard-profile-avatar">A</div>
          <img class="dashboard-profile-avatar-img" id="dashboard-profile-avatar-img" alt="" hidden />
          <label class="dashboard-profile-avatar-btn" for="dashboard-profile-avatar-input">Change photo</label>
          <input type="file" id="dashboard-profile-avatar-input" class="dashboard-profile-avatar-input" accept="image/*" hidden />
        </div>
        <p class="dashboard-profile-email" id="dashboard-profile-email-display">alex@racelia.com</p>
        <form id="dashboard-profile-form" class="dashboard-profile-form">
          <div class="dashboard-profile-field">
            <label for="dashboard-profile-name">Name</label>
            <input type="text" id="dashboard-profile-name" name="name" autocomplete="name" required />
          </div>
          <div class="dashboard-profile-field dashboard-profile-field--readonly">
            <label for="dashboard-profile-email">Email</label>
            <input type="email" id="dashboard-profile-email" name="email" readonly tabindex="-1" />
          </div>
          <button type="submit" class="dashboard-profile-save">Save changes</button>
        </form>
      </div>
    </div>
  </div>

  <div class="dashboard-sheet-overlay" id="dashboard-notifications-overlay" aria-hidden="true">
    <div class="dashboard-sheet profile-sheet" role="dialog" aria-labelledby="dashboard-notifications-title">
      <div class="dashboard-sheet-header">
        <h3 id="dashboard-notifications-title">Notifications</h3>
        <button type="button" class="dashboard-sheet-close" data-close="dashboard-notifications-overlay">Close</button>
      </div>
      <p class="dashboard-notifications-intro">New orders waiting for a situation (fulfillment status).</p>
      <div class="dashboard-notifications-list" id="dashboard-notifications-list" role="list"></div>
      <p class="dashboard-notifications-empty" id="dashboard-notifications-empty" hidden>All caught up — every recent order has a situation.</p>
    </div>
  </div>
`;
}
