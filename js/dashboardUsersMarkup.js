export function getDashboardUsersSectionMarkup() {
  return `
      <div class="page-head">
        <div>
          <h1 class="page-title">Users</h1>
          <p class="page-sub">Manage customers, gift points, and order history.</p>
        </div>
        <button type="button" class="primary-btn js-dashboard-user-add-open">+ Add user</button>
      </div>
      <div class="users-table" id="dashboard-users-table">
        <div class="users-head dashboard-users-head">
          <span>Name</span>
          <span>Email</span>
          <span>Points</span>
          <span>Orders</span>
          <span>Actions</span>
        </div>
        <div id="dashboard-users-rows"></div>
      </div>
      <p class="dashboard-users-empty" id="dashboard-users-empty" hidden>No users yet.</p>
  `;
}

export function getDashboardUsersOverlaysMarkup() {
  return `
  <div class="dashboard-sheet-overlay" id="dashboard-add-user-overlay" aria-hidden="true">
    <div class="dashboard-sheet profile-sheet dashboard-user-sheet" role="dialog" aria-labelledby="dashboard-add-user-title">
      <div class="dashboard-sheet-header">
        <h3 id="dashboard-add-user-title">Add user</h3>
        <button type="button" class="dashboard-sheet-close" data-close="dashboard-add-user-overlay">Close</button>
      </div>
      <form class="dashboard-user-form" id="dashboard-add-user-form">
        <div class="dashboard-user-field">
          <label for="dash-user-name">Name</label>
          <input type="text" id="dash-user-name" name="name" required autocomplete="name" />
        </div>
        <div class="dashboard-user-field">
          <label for="dash-user-email">Email</label>
          <input type="email" id="dash-user-email" name="email" required autocomplete="email" />
        </div>
        <div class="dashboard-user-field">
          <label for="dash-user-password">Password</label>
          <input type="password" id="dash-user-password" name="password" required autocomplete="new-password" minlength="6" />
        </div>
        <button type="submit" class="dashboard-user-submit">Create user</button>
      </form>
    </div>
  </div>

  <div class="dashboard-sheet-overlay" id="dashboard-user-points-overlay" aria-hidden="true">
    <div class="dashboard-sheet profile-sheet dashboard-user-sheet" role="dialog" aria-labelledby="dashboard-user-points-title">
      <div class="dashboard-sheet-header">
        <h3 id="dashboard-user-points-title">Gift points</h3>
        <button type="button" class="dashboard-sheet-close" data-close="dashboard-user-points-overlay">Close</button>
      </div>
      <p class="dashboard-user-points-user" id="dashboard-user-points-name"></p>
      <p class="dashboard-user-points-balance">Current balance: <strong id="dashboard-user-points-current">0</strong> pts</p>
      <form class="dashboard-user-form" id="dashboard-user-points-form">
        <input type="hidden" id="dashboard-user-points-id" value="" />
        <div class="dashboard-user-field">
          <label for="dashboard-user-points-amount">Points to add</label>
          <input type="number" id="dashboard-user-points-amount" name="amount" min="1" step="1" required placeholder="e.g. 150" />
        </div>
        <button type="submit" class="dashboard-user-submit">Add points</button>
      </form>
    </div>
  </div>

  <div class="dashboard-sheet-overlay" id="dashboard-user-orders-overlay" aria-hidden="true">
    <div class="dashboard-sheet profile-sheet dashboard-user-sheet" role="dialog" aria-labelledby="dashboard-user-orders-title">
      <div class="dashboard-sheet-header">
        <h3 id="dashboard-user-orders-title">User orders</h3>
        <button type="button" class="dashboard-sheet-close" data-close="dashboard-user-orders-overlay">Close</button>
      </div>
      <p class="dashboard-user-orders-user" id="dashboard-user-orders-name"></p>
      <div class="dashboard-user-orders-list" id="dashboard-user-orders-list"></div>
      <p class="dashboard-user-orders-empty" id="dashboard-user-orders-empty" hidden>No orders for this user.</p>
    </div>
  </div>

  <div class="dashboard-sheet-overlay" id="dashboard-user-profile-overlay" aria-hidden="true">
    <div class="dashboard-sheet profile-sheet dashboard-user-sheet dashboard-user-profile-sheet" role="dialog" aria-labelledby="dashboard-user-profile-title">
      <div class="dashboard-sheet-header">
        <h3 id="dashboard-user-profile-title">User profile</h3>
        <button type="button" class="dashboard-sheet-close" data-close="dashboard-user-profile-overlay">Close</button>
      </div>
      <div class="dashboard-user-profile-hero">
        <div class="dashboard-user-profile-avatar-wrap" id="dashboard-user-profile-avatar-wrap">
          <span class="dashboard-user-profile-avatar-letter" id="dashboard-user-profile-avatar-letter"></span>
          <img class="dashboard-user-profile-avatar-img" id="dashboard-user-profile-avatar-img" alt="" hidden />
        </div>
        <p class="dashboard-user-profile-name" id="dashboard-user-profile-name"></p>
        <p class="dashboard-user-profile-role" id="dashboard-user-profile-role"></p>
      </div>
      <dl class="dashboard-user-profile-details">
        <div class="dashboard-user-profile-detail">
          <dt>Email</dt>
          <dd id="dashboard-user-profile-email"></dd>
        </div>
        <div class="dashboard-user-profile-detail">
          <dt>Phone</dt>
          <dd id="dashboard-user-profile-phone"></dd>
        </div>
        <div class="dashboard-user-profile-detail">
          <dt>Address</dt>
          <dd id="dashboard-user-profile-address"></dd>
        </div>
        <div class="dashboard-user-profile-detail">
          <dt>Wilaya</dt>
          <dd id="dashboard-user-profile-wilaya"></dd>
        </div>
        <div class="dashboard-user-profile-detail">
          <dt>Commune</dt>
          <dd id="dashboard-user-profile-commune"></dd>
        </div>
        <div class="dashboard-user-profile-detail">
          <dt>Member since</dt>
          <dd id="dashboard-user-profile-since"></dd>
        </div>
        <div class="dashboard-user-profile-detail">
          <dt>Status</dt>
          <dd id="dashboard-user-profile-status"></dd>
        </div>
        <div class="dashboard-user-profile-detail">
          <dt>Gift points</dt>
          <dd id="dashboard-user-profile-points"></dd>
        </div>
        <div class="dashboard-user-profile-detail">
          <dt>Orders</dt>
          <dd id="dashboard-user-profile-orders"></dd>
        </div>
      </dl>
      <div class="dashboard-user-profile-cards" id="dashboard-user-profile-cards"></div>
      <div class="dashboard-user-profile-actions">
        <button type="button" class="dashboard-user-action js-dashboard-user-profile-orders">View orders</button>
        <button type="button" class="dashboard-user-action js-dashboard-user-profile-points">Manage points</button>
      </div>
    </div>
  </div>
`;
}
