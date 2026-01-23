function ElementH1()
{
    this.setup = function(parent, value)
    {
        this.buildElement(parent, value)
    }

    this.buildElement = function(parent, value)
    {
        let textContent = document.createTextNode(value);

        let title = document.createElement("h1");
        title.className = "overview-setting-h1";

        title.appendChild(textContent);
        parent.appendChild(title);
    }
}