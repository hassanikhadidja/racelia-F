export function getDashboardEmailsSectionMarkup() {
  return `
      <div class="page-head">
        <div>
          <h1 class="page-title">Emails &amp; retours</h1>
          <p class="page-sub">Collected addresses and return, exchange, or claim requests.</p>
        </div>
        <button type="button" class="primary-btn js-dashboard-email-add-open" id="dashboard-emails-add-btn">+ Add email</button>
      </div>
      <div class="dashboard-emails-filters" role="tablist" aria-label="Emails or returns">
        <button type="button" class="dashboard-emails-filter active" role="tab" aria-selected="true" data-emails-tab="emails" id="dash-emails-tab-emails">Emails</button>
        <button type="button" class="dashboard-emails-filter" role="tab" aria-selected="false" data-emails-tab="returns" id="dash-emails-tab-returns">
          Retours <span class="dashboard-emails-filter-badge js-dash-returns-badge" hidden>0</span>
        </button>
      </div>

      <div id="dashboard-emails-panel" role="tabpanel" aria-labelledby="dash-emails-tab-emails">
        <div class="users-table dashboard-emails-table" id="dashboard-emails-table">
          <div class="users-head dashboard-emails-head">
            <span>Name</span>
            <span>Email</span>
            <span>Newsletter</span>
            <span>Source</span>
            <span>Actions</span>
          </div>
          <div id="dashboard-emails-rows"></div>
        </div>
        <p class="dashboard-emails-empty" id="dashboard-emails-empty" hidden>No emails collected yet.</p>
      </div>

      <div id="dashboard-returns-panel" role="tabpanel" aria-labelledby="dash-emails-tab-returns" hidden>
        <div class="dashboard-returns-filters" role="tablist" aria-label="Filter by status">
          <button type="button" class="dashboard-returns-filter active" data-return-status="all">All <span class="dashboard-returns-count">(0)</span></button>
          <button type="button" class="dashboard-returns-filter" data-return-status="pending">Pending <span class="dashboard-returns-count">(0)</span></button>
          <button type="button" class="dashboard-returns-filter" data-return-status="in_progress">In progress <span class="dashboard-returns-count">(0)</span></button>
          <button type="button" class="dashboard-returns-filter" data-return-status="solved">Solved <span class="dashboard-returns-count">(0)</span></button>
          <button type="button" class="dashboard-returns-filter" data-return-status="closed">Closed <span class="dashboard-returns-count">(0)</span></button>
        </div>
        <div class="dashboard-returns-filters" role="tablist" aria-label="Filter by request type">
          <button type="button" class="dashboard-returns-filter active" data-return-type="all">All <span class="dashboard-returns-count">(0)</span></button>
          <button type="button" class="dashboard-returns-filter" data-return-type="retour">Retour <span class="dashboard-returns-count">(0)</span></button>
          <button type="button" class="dashboard-returns-filter" data-return-type="echange">Échange <span class="dashboard-returns-count">(0)</span></button>
          <button type="button" class="dashboard-returns-filter" data-return-type="reclamation">Réclamation <span class="dashboard-returns-count">(0)</span></button>
        </div>
        <div class="dashboard-returns-list" id="dashboard-returns-list"></div>
        <p class="dashboard-emails-empty" id="dashboard-returns-empty" hidden>No return requests yet.</p>
      </div>
  `;
}

export function getDashboardEmailsOverlaysMarkup() {
  return `
  <div class="dashboard-sheet-overlay" id="dashboard-add-email-overlay" aria-hidden="true">
    <div class="dashboard-sheet profile-sheet dashboard-user-sheet" role="dialog" aria-labelledby="dashboard-add-email-title">
      <div class="dashboard-sheet-header">
        <h3 id="dashboard-add-email-title">Add email</h3>
        <button type="button" class="dashboard-sheet-close" data-close="dashboard-add-email-overlay">Close</button>
      </div>
      <form class="dashboard-user-form" id="dashboard-add-email-form">
        <div class="dashboard-user-field">
          <label for="dash-email-name">Name</label>
          <input type="text" id="dash-email-name" name="name" autocomplete="name" />
        </div>
        <div class="dashboard-user-field">
          <label for="dash-email-address">Email</label>
          <input type="email" id="dash-email-address" name="email" required autocomplete="email" />
        </div>
        <div class="dashboard-user-field">
          <label for="dash-email-newsletter">Newsletter</label>
          <select id="dash-email-newsletter" name="newsletter">
            <option value="yes" selected>Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <button type="submit" class="dashboard-user-submit">Save email</button>
      </form>
    </div>
  </div>

  <div class="dashboard-sheet-overlay" id="dashboard-return-detail-overlay" aria-hidden="true">
    <div class="dashboard-sheet profile-sheet dashboard-user-sheet dashboard-return-detail-sheet" role="dialog" aria-labelledby="dashboard-return-detail-title">
      <div class="dashboard-sheet-header">
        <h3 id="dashboard-return-detail-title">Return request</h3>
        <button type="button" class="dashboard-sheet-close" data-close="dashboard-return-detail-overlay">Close</button>
      </div>
      <dl class="dashboard-user-profile-details" id="dashboard-return-detail-fields"></dl>
      <div class="dashboard-return-detail-photo" id="dashboard-return-detail-photo" hidden>
        <img id="dashboard-return-detail-img" alt="Request picture" />
      </div>
    </div>
  </div>
`;
}
