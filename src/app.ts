class App {
  root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
    this.render();
  }

  render() {
    this.root.innerHTML = "Hello";
  }
}

export default App;
