function ElementButton()
{
    this.button = null;

    this.setup = function(parent, labelText, onClick)
    {
        this.button = document.createElement("button");
        this.button.className = "overview-button";
        this.button.textContent = labelText;
        if (typeof onClick === "function")
        {
            this.button.addEventListener("click", onClick, false);
        }
        parent.appendChild(this.button);
    }
}
