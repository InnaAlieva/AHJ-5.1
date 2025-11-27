import createButton from '../../components/popovers/createButton';

test('Test btn', () => {
  const text = "Popover TitleAnd here's some amazing content. It's very engaging. Right?";

  document.body.innerHTML = '<div class="popovers"></div>';
  createButton();
  const btn = document.querySelector('.btnPopovers');
  btn.click();
  const result = document.querySelector('.messagePopovers').textContent;

  expect(result).toEqual(text);
});
