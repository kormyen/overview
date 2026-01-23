function ElementH2()
{
    this.setup = function(parent, value)
    {
        this.buildElement(parent, value)
    }

    this.buildElement = function(parent, value)
    {
        let textContent = document.createTextNode(value);

        let title = document.createElement("h2");
        title.className = "overview-setting-h2";

        title.appendChild(textContent);
        parent.appendChild(title);
    }
}