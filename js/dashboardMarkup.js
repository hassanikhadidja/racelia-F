import { getDashboardAccountOverlaysMarkup } from "./dashboardAccountMarkup.js";
import { getDashboardReviewsSectionMarkup } from "./dashboardReviewsMarkup.js";
import { getDashboardWebPicsSectionMarkup } from "./dashboardWebPicsMarkup.js";
import { getDashboardRaceliaStyleSectionMarkup } from "./dashboardRaceliaStyleMarkup.js";
import { getDashboardUsersSectionMarkup } from "./dashboardUsersMarkup.js";
import { getDashboardBlogsSectionMarkup } from "./dashboardBlogsMarkup.js";
import { getDashboardProductsSectionMarkup } from "./dashboardProductsMarkup.js";

/** @generated from dashboard.html — do not edit by hand */
export function getDashboardMarkup() {
  return `
  <main class="main">
    <header class="dashboard-topbar">
      <div class="logo">
        <div class="logo-mark"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg></div>
        RACÈLIA
      </div>
      <button type="button" class="dashboard-store-btn js-dashboard-store-btn" aria-label="Back to store">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        <span>Back to store</span>
      </button>
      <div class="search-bar search-bar--compact">
        <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        <input type="search" placeholder="Search store…" aria-label="Search store" />
      </div>
      <div class="topbar-actions">
        <button type="button" class="icon-btn js-dashboard-notifications-open" aria-label="Notifications">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
          <span class="icon-btn-badge js-dashboard-notifications-badge" aria-hidden="true">5</span>
        </button>
        <div class="avatar-sm js-dashboard-avatar-sm">A</div>
      </div>
    </header>

    <!-- Overview -->
    <section class="content active" id="overview" role="tabpanel" aria-labelledby="tab-overview">
      <div class="page-head"><div><h1 class="page-title">Overview</h1><p class="page-sub">Welcome back, here's your store performance.</p></div></div>
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-top"><div class="stat-icon"><svg viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg></div><div class="stat-num">$247K</div></div><div class="stat-label">Net Revenue</div><div class="stat-change up">▲ +6,2%</div></div>
        <div class="stat-card"><div class="stat-top"><div class="stat-icon"><svg viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.1 17 7 17h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0023.46 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg></div><div class="stat-num">658</div></div><div class="stat-label">Total Orders</div><div class="stat-change up">▲ +2,5%</div></div>
        <div class="stat-card"><div class="stat-top"><div class="stat-icon"><svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg></div><div class="stat-num">788</div></div><div class="stat-label">Total Views</div><div class="stat-change down">▼ -1,8%</div></div>
        <div class="stat-card"><div class="stat-top"><div class="stat-icon"><svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg></div><div class="stat-num">82%</div></div><div class="stat-label">Conversion</div><div class="stat-change up">▲ +2,0%</div></div>
      </div>
      <div class="panel">
        <div class="section-header"><div class="section-title">Revenue Overview</div><div class="tab-group"><button class="tab" data-period="Today">Today</button><button class="tab active" data-period="Weekly">Weekly</button><button class="tab" data-period="Monthly">Monthly</button></div></div>
        <div class="bar-chart" id="chart"></div>
      </div>
    </section>

    <!-- Product / Target Orders -->
    <section class="content" id="product">
      <div class="page-head"><div><h1 class="page-title">Target Orders</h1><p class="page-sub">Weekly target progress and top-selling products.</p></div></div>
      <div class="two-col">
        <div class="panel"><div class="section-title" style="margin-bottom:12px">Weekly Target</div>
          <div class="gauge-wrap">
            <svg class="gauge-svg" viewBox="0 0 240 140">
              <path d="M 24 124 A 96 96 0 0 1 216 124" fill="none" stroke="#E2E8F0" stroke-width="20" stroke-linecap="round"/>
              <path id="targetOrdersGaugeProgress" d="M 24 124 A 96 96 0 0 1 216 124" fill="none" stroke="#000000" stroke-width="20" stroke-linecap="round" stroke-dasharray="302" stroke-dashoffset="54"/>
              <g transform="rotate(-4, 120, 124)"><line x1="120" y1="124" x2="120" y2="38" stroke="#1E293B" stroke-width="2.5" stroke-linecap="round"/><circle cx="120" cy="124" r="7" fill="#1E293B"/><circle cx="120" cy="124" r="3.5" fill="white"/></g>
            </svg>
            <div class="gauge-label" id="targetOrdersGaugeLabel">You completed <strong>82%</strong> of your target orders than the previous week</div>
          </div>
        </div>
        <div class="panel">
          <div class="report-header">
            <div class="section-title">Sales Report</div>
            <div class="period-select-wrap">
              <select class="period-select" id="targetOrdersPeriod" aria-label="Report period">
                <option value="last-week" selected>Last Week</option>
                <option value="this-week">This Week</option>
                <option value="last-month">Last Month</option>
                <option value="this-month">This Month</option>
                <option value="last-quarter">Last Quarter</option>
                <option value="last-year">Last Year</option>
              </select>
              <svg class="period-select-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5z"/></svg>
            </div>
          </div>
          <div class="report-table">
            <div class="table-head"><span>No</span><span>Product Name</span><span style="text-align:center">Sold</span><span style="text-align:right">Profits</span></div>
            <div id="targetOrdersReportBody"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Order / Products -->
    <section class="content" id="order">
      ${getDashboardProductsSectionMarkup()}
    </section>

    <!-- Analytics -->
    <section class="content" id="analytics">
      <div class="page-head"><div><h1 class="page-title">Analytics</h1><p class="page-sub">Order breakdown, top bag categories, and weekly summary.</p></div></div>
      <div class="analytics-grid">
        <div class="analytics-card">
          <div class="analytics-card-header"><div class="analytics-card-title">Orders Breakdown</div><div class="analytics-badge badge-green">▲ +12.4%</div></div>
          <div class="donut-row">
            <div class="donut-wrap">
              <svg viewBox="0 0 70 70"><circle cx="35" cy="35" r="28" fill="none" stroke="#E2E8F0" stroke-width="10"/><circle cx="35" cy="35" r="28" fill="none" stroke="#000000" stroke-width="10" stroke-dasharray="175.9" stroke-dashoffset="44" transform="rotate(-90 35 35)"/><circle cx="35" cy="35" r="28" fill="none" stroke="#d6d6d6" stroke-width="10" stroke-dasharray="175.9" stroke-dashoffset="-131.9" transform="rotate(-90 35 35)"/></svg>
              <div class="donut-center">75%<small>received</small></div>
            </div>
            <div class="donut-legend">
              <div class="legend-item"><div class="legend-dot" style="background:#000000"></div>Orders Received<span class="legend-val">186</span></div>
              <div class="legend-item"><div class="legend-dot" style="background:#d6d6d6"></div>Orders Returned<span class="legend-val">24</span></div>
              <div class="legend-item"><div class="legend-dot" style="background:#E2E8F0"></div>Orders Processed<span class="legend-val">312</span></div>
            </div>
          </div>
        </div>
        <div class="analytics-card">
          <div class="analytics-card-header"><div class="analytics-card-title">Top Categories of the Bags</div><div class="analytics-badge badge-red">▼ -3.1%</div></div>
          <div class="mini-bar-row">
            <div class="mini-bar-item"><div class="mini-bar-label"><span>Mini Bags</span><span>82 orders</span></div><div class="mini-bar-track"><div class="mini-bar-fill" style="width:88%;background:#000000"></div></div></div>
            <div class="mini-bar-item"><div class="mini-bar-label"><span>The RACÈLIA Handbag</span><span>74 orders</span></div><div class="mini-bar-track"><div class="mini-bar-fill" style="width:82%;background:#333333"></div></div></div>
            <div class="mini-bar-item"><div class="mini-bar-label"><span>Moms Bags</span><span>68 orders</span></div><div class="mini-bar-track"><div class="mini-bar-fill" style="width:78%;background:#bdbdbd"></div></div></div>
            <div class="mini-bar-item"><div class="mini-bar-label"><span>All Selection</span><span>59 orders</span></div><div class="mini-bar-track"><div class="mini-bar-fill" style="width:68%;background:#d6d6d6"></div></div></div>
          </div>
        </div>
        <div class="analytics-card">
          <div class="analytics-card-header"><div class="analytics-card-title">Weekly Summary</div><div class="analytics-badge badge-green">▲ +8.2%</div></div>
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <div class="summary-tile" style="background:#f0f0f0;color:#000000"><div class="st-num">2,167</div><div class="st-label">Total Units</div></div>
            <div class="summary-tile" style="background:#D1FAE5;color:#065F46"><div class="st-num">$303K</div><div class="st-label">Revenue</div></div>
            <div class="summary-tile" style="background:#FEF3C7;color:#92400E"><div class="st-num">4.8★</div><div class="st-label">Avg Rating</div></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Blogs -->
    <section class="content" id="blogs">
      ${getDashboardBlogsSectionMarkup()}
    </section>

    <!-- Users -->
    <section class="content" id="users">
      ${getDashboardUsersSectionMarkup()}
    </section>

    <!-- RACÈLIASTYLE -->
    <section class="content" id="raceliastyle">
      ${getDashboardRaceliaStyleSectionMarkup()}
    </section>

    <!-- Web Pics -->
    <section class="content" id="webpics">
      ${getDashboardWebPicsSectionMarkup()}
    </section>

    <!-- Reviews -->
    <section class="content" id="reviews">
      ${getDashboardReviewsSectionMarkup()}
    </section>

    <!-- Account -->
    <section class="content" id="account">
      <div class="panel" style="display:flex;gap:24px;align-items:center;flex-wrap:wrap">
        <div class="avatar-lg js-dashboard-avatar-lg">A</div>
        <div style="flex:1;min-width:200px"><div class="account-name js-dashboard-account-name">Alex Johnson</div><div class="account-role">Store Manager · RACÈLIA</div></div>
        <div class="account-stats">
          <div class="acc-stat"><div class="acc-stat-num">658</div><div class="acc-stat-label">Orders</div></div>
          <div class="acc-divider"></div>
          <div class="acc-stat"><div class="acc-stat-num">$303K</div><div class="acc-stat-label">Revenue</div></div>
          <div class="acc-divider"></div>
          <div class="acc-stat"><div class="acc-stat-num">$247K</div><div class="acc-stat-label">Net Revenue</div></div>
        </div>
      </div>
      <div class="panel">
        <div class="section-title" style="margin-bottom:12px">Settings</div>
        <div class="menu-list">
          <button type="button" class="menu-item js-dashboard-profile-open"><div class="menu-icon"><svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div><div class="menu-text"><div class="menu-label">My Profile</div><div class="menu-sub">Name, email & photo</div></div><div class="menu-arrow"><svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg></div></button>
          <button type="button" class="menu-item js-dashboard-notifications-open"><div class="menu-icon"><svg viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg></div><div class="menu-text"><div class="menu-label">Notifications</div><div class="menu-sub js-dashboard-notifications-sub">Orders need a situation</div></div><span class="menu-badge js-dashboard-notifications-badge" aria-hidden="true">5</span><div class="menu-arrow"><svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg></div></button>
        </div>
      </div>
    </section>
  </main>
  ${getDashboardAccountOverlaysMarkup()}

  <div class="bottom-nav-wrap">
    <nav class="bottom-nav" role="tablist" aria-label="Main navigation">
      <span class="nav-indicator" aria-hidden="true"></span>
      <button type="button" class="bottom-nav-item active" role="tab" aria-selected="true" data-screen="overview" id="tab-overview">
        <span class="bottom-icon"><svg class="icon-grid" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg></span>
        <span>Overview</span>
      </button>
      <button type="button" class="bottom-nav-item" role="tab" aria-selected="false" data-screen="order" id="tab-order">
        <span class="bottom-icon"><svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg></span>
        <span>Products</span>
      </button>
      <button type="button" class="bottom-nav-item" role="tab" aria-selected="false" data-screen="product" id="tab-product">
        <span class="bottom-icon"><svg class="icon-filled" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zM7 16h11.5c.75 0 1.41-.41 1.75-1.03l3.24-5.88A1 1 0 0022.62 7H5.21l-.94-2H1v2h2l3.6 7.59L5.25 17H19v-2H7.42l-.42-.84z"/></svg></span>
        <span>Orders</span>
      </button>
      <button type="button" class="bottom-nav-item" role="tab" aria-selected="false" data-screen="analytics" id="tab-analytics">
        <span class="bottom-icon"><svg viewBox="0 0 24 24"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg></span>
        <span>Analytics</span>
      </button>
      <button type="button" class="bottom-nav-item" role="tab" aria-selected="false" data-screen="blogs" id="tab-blogs">
        <span class="bottom-icon"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg></span>
        <span>Blogs</span>
      </button>
      <button type="button" class="bottom-nav-item" role="tab" aria-selected="false" data-screen="users" id="tab-users">
        <span class="bottom-icon"><svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg></span>
        <span>Users</span>
      </button>
      <button type="button" class="bottom-nav-item" role="tab" aria-selected="false" data-screen="raceliastyle" id="tab-raceliastyle">
        <span class="bottom-icon"><svg viewBox="0 0 24 24"><path d="M6 3h12l4 6-10 13L2 9z"/><path d="M11 3L8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg></span>
        <span class="nav-label-long">RACÈLIASTYLE</span>
      </button>
      <button type="button" class="bottom-nav-item" role="tab" aria-selected="false" data-screen="webpics" id="tab-webpics">
        <span class="bottom-icon"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></span>
        <span>Web Pics</span>
      </button>
      <button type="button" class="bottom-nav-item" role="tab" aria-selected="false" data-screen="reviews" id="tab-reviews">
        <span class="bottom-icon"><svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></span>
        <span>Reviews</span>
      </button>
      <button type="button" class="bottom-nav-item" role="tab" aria-selected="false" data-screen="account" id="tab-account">
        <span class="bottom-icon"><svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
        <span>Account</span>
      </button>
    </nav>
  </div>
`;
}
