import { createCtaDock } from "./CtaDock.js";

export function createBlogsPage() {
  const page = document.createElement("section");
  page.className = "blogs-page";
  page.id = "blogsPage";
  page.hidden = true;

  page.innerHTML = `
    <div class="blogs-page__list-view" id="blogsListView">
      <h1 class="blogs-page__title">Métiers d'Art</h1>
      <p class="blogs-page__sub">Récits, savoir-faire et collections de RACÈLIA.</p>
      <div class="blogs-page__grid" id="blogsGrid"></div>
      <p class="blogs-page__empty" id="blogsEmpty" hidden>Aucune histoire publiée pour le moment. Revenez bientôt.</p>
    </div>
    <div class="blogs-page__article-view" id="blogsArticleView" hidden>
      <button type="button" class="blogs-page__back" id="blogsBackBtn">← Toutes les histoires</button>
      <div class="blogs-page__article" id="blogsArticle"></div>
    </div>
  `;

  page.appendChild(createCtaDock({ sectionId: "blogsCtaDock", slotId: "blogsCtaDockSlot" }));
  return page;
}
