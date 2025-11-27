export default function createButton() {
  const divPopovers = document.querySelector('.popovers');

  divPopovers.innerHTML = '<button type="button" class="btnPopovers">Click to toggle popover</button>';

  const btnPopovers = document.querySelector('.btnPopovers');
  const attributename = 'data-content';
  const attributevalue = "And here's some amazing content. It's very engaging. Right?";
  btnPopovers.setAttribute(attributename, attributevalue);

  btnPopovers.addEventListener('click', () => {
    const btnPopoverYesNo = document.querySelector('.messagePopovers');
    if (btnPopoverYesNo) {
      btnPopoverYesNo.remove();
    } else {
      const massege = document.querySelector('.btnPopovers').getAttribute('data-content');
      const tooltipElement = document.createElement('div');
      tooltipElement.classList.add('messagePopovers');
      const popoverText = document.createElement('p');
      popoverText.textContent = massege;
      tooltipElement.prepend(popoverText);
      const popoverTitle = document.createElement('p');
      popoverTitle.innerHTML = '<b>Popover Title</b><br>';
      tooltipElement.prepend(popoverTitle);

      document.body.appendChild(tooltipElement);

      const { right, top } = btnPopovers.getBoundingClientRect();
      const { width } = tooltipElement.getBoundingClientRect();
      tooltipElement.style.left = `${right - width / 2 - 170 / 2}px`;
      tooltipElement.style.top = `${top - 5 - tooltipElement.offsetHeight}px`;
    }
  });
}
