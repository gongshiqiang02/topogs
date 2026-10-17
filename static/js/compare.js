// Before/after slider galleries built on image-compare-viewer.
// Each gallery has a row of tab buttons (scenes or modalities), an optional
// row of view buttons, and a single slider. Entries with `before: null` are
// shown as a placeholder until the renders are available.

const IMG = './static/images/';

const RENDERING = [
  { name: 'Building', views: [
    { before: 'rendering/building_000194_citygsx.jpg', after: 'rendering/building_000194_topogs.jpg', baseline: 'CityGS-X', tag: 'Mill19 · 000194' },
    { before: 'rendering/building_001358_citygsx.jpg', after: 'rendering/building_001358_topogs.jpg', baseline: 'CityGS-X', tag: 'Mill19 · 001358' },
  ]},
  { name: 'Rubble', views: [
    { before: null, baseline: 'CityGS-X', tag: 'Mill19' },
  ]},
  { name: 'Residence', views: [
    { before: 'rendering/residence_000207_citygsx.jpg', after: 'rendering/residence_000207_topogs.jpg', baseline: 'CityGS-X', tag: 'UrbanScene3D · 000207' },
    { before: 'rendering/residence_001176_citygsx.jpg', after: 'rendering/residence_001176_topogs.jpg', baseline: 'CityGS-X', tag: 'UrbanScene3D · 001176' },
  ]},
  { name: 'Sci-Art', views: [
    { before: null, baseline: 'CityGS-X', tag: 'UrbanScene3D' },
  ]},
  { name: 'Train', views: [
    { before: 'rendering/train_00105_geogs.jpg', after: 'rendering/train_00105_topogs.jpg', baseline: 'Geo-GS', tag: 'Tanks & Temples · 00105' },
    { before: 'rendering/train_00129_geogs.jpg', after: 'rendering/train_00129_topogs.jpg', baseline: 'Geo-GS', tag: 'Tanks & Temples · 00129' },
  ]},
  { name: 'Truck', views: [
    { before: 'rendering/truck_000057_geogs.jpg', after: 'rendering/truck_000057_topogs.jpg', baseline: 'Geo-GS', tag: 'Tanks & Temples · 000057' },
    { before: 'rendering/truck_000081_geogs.jpg', after: 'rendering/truck_000081_topogs.jpg', baseline: 'Geo-GS', tag: 'Tanks & Temples · 000081' },
  ]},
];

const GEOMETRY = [
  { name: 'Normal', views: [
    { before: 'geometry/residence_000207_normal_citygsx.jpg', after: 'geometry/residence_000207_normal_topogs.jpg', baseline: 'CityGS-X', tag: 'Residence · 000207' },
    { before: 'geometry/residence_001176_normal_citygsx.jpg', after: 'geometry/residence_001176_normal_topogs.jpg', baseline: 'CityGS-X', tag: 'Residence · 001176' },
  ]},
  { name: 'Depth', views: [
    { before: 'geometry/residence_000207_depth_citygsx.jpg', after: 'geometry/residence_000207_depth_topogs.jpg', baseline: 'CityGS-X', tag: 'Residence · 000207' },
    { before: 'geometry/residence_001176_depth_citygsx.jpg', after: 'geometry/residence_001176_depth_topogs.jpg', baseline: 'CityGS-X', tag: 'Residence · 001176' },
  ]},
  { name: 'Mesh', views: [
    { before: 'geometry/residence_mesh_overview_citygsx.jpg', after: 'geometry/residence_mesh_overview_topogs.jpg', baseline: 'CityGS-X', tag: 'Residence · Overview' },
    { before: 'geometry/residence_mesh_zoom_citygsx.jpg', after: 'geometry/residence_mesh_zoom_topogs.jpg', baseline: 'CityGS-X', tag: 'Residence · Close-up' },
  ]},
];

function makeButtons(container, labels, onSelect) {
  container.innerHTML = '';
  labels.forEach((label, i) => {
    const btn = document.createElement('button');
    btn.className = 'button is-small is-rounded';
    btn.type = 'button';
    btn.textContent = label;
    btn.addEventListener('click', () => {
      container.querySelectorAll('.button').forEach(b => {
        b.classList.remove('is-dark');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-dark');
      btn.setAttribute('aria-pressed', 'true');
      onSelect(i);
    });
    container.appendChild(btn);
  });
  container.querySelector('.button').click();
}

function showPair(stage, caption, view) {
  stage.innerHTML = '';
  caption.textContent = view.tag;

  if (!view.before) {
    const ph = document.createElement('div');
    ph.className = 'compare-placeholder';
    ph.textContent = `${view.baseline} vs. TopoGS · renders coming soon`;
    stage.appendChild(ph);
    return;
  }

  const el = document.createElement('div');
  el.className = 'image-compare';
  [view.before, view.after].forEach((src, k) => {
    const img = document.createElement('img');
    img.src = IMG + src;
    img.alt = k === 0 ? `${view.baseline} rendering` : 'TopoGS rendering';
    el.appendChild(img);
  });
  stage.appendChild(el);

  // Mount once the first image has a size, otherwise the viewer collapses.
  const first = el.querySelector('img');
  const mount = () => new ImageCompare(el, {
    addCircle: true,
    hoverStart: false,
    showLabels: true,
    labelOptions: { before: view.baseline, after: 'TopoGS (Ours)', onHover: false },
  }).mount();
  first.complete ? mount() : first.addEventListener('load', mount, { once: true });
}

function initGallery(rootId, data) {
  const root = document.getElementById(rootId);
  if (!root) return;
  const tabs = root.querySelector('.compare-tabs');
  const views = root.querySelector('.compare-views');
  const stage = root.querySelector('.compare-stage');
  const caption = root.querySelector('.compare-caption');

  makeButtons(tabs, data.map(d => d.name), i => {
    const entry = data[i];
    views.style.display = entry.views.length > 1 ? '' : 'none';
    makeButtons(views, entry.views.map((_, k) => `View ${k + 1}`),
      k => showPair(stage, caption, entry.views[k]));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initGallery('rendering-compare', RENDERING);
  initGallery('geometry-compare', GEOMETRY);
});
