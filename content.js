const style = document.createElement('style');
style.textContent = `
  .drop-overlay {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    z-index: 9999;
    pointer-events: none; 
  }
  .file-container {
    position: relative;
  }`;

document.head.appendChild(style);

function createOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'drop-overlay';
  overlay.textContent = 'ここにドロップ';
  return overlay;
}

document.addEventListener('dragover', e => {
  e.preventDefault();
  const dropTarget = e.target.closest('.file-container');
  if (!dropTarget || dropTarget.querySelector('.drop-overlay')) return;

  const overlay = createOverlay();
  dropTarget.appendChild(overlay);
})

document.addEventListener('dragleave', e => {
  const dropTarget = e.target.closest('.file-container');
  if (!dropTarget) return;

  const overlay = dropTarget.querySelector('.drop-overlay');
  if (overlay) overlay.remove();
})

document.addEventListener('drop', e => {
  const dropTarget = e.target.closest('.file-container');
  if (!dropTarget) return;

  e.preventDefault();

  const overlay = dropTarget.querySelector('.drop-overlay');
  if (overlay) overlay.remove();

  //以下ファイル処理
  const fileInput = dropTarget.querySelector('input[type="file"]');
  if (!fileInput) return;

  const file = e.dataTransfer.files[0];
  if (file) {
    const accepts = fileInput.getAttribute('accept');
    if (accepts) {
      const isValid = accepts
        .toLowerCase()
        .split(',')
        .some(ext => file.name.toLowerCase().endsWith(ext.trim()));

      if (!isValid) {
        alert('このファイル形式は許可されていません。');
        return;
      }
    }

    const data = new DataTransfer();
    data.items.add(file);
    fileInput.files = data.files;
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
  }
})
