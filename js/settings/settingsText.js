function SettingsText()
{
    this.input = null;
    this.button = null;
    const eventUpdated = new CustomEvent("settingUpdated");

    this.setup = function(parent, labelText, value)
    {
        this.buildElement(parent, labelText, value)
        // this.checkbox.addEventListener("change", this, true);
        this.button.addEventListener("click", this, false);
    }

    this.buildElement = function(parent, labelText, value)
    {
        this.button = document.createElement("button");
        this.button.className = "overview-button"; 

        let textContent = document.createTextNode(labelText);

        let input = document.createElement("input");
        input.type = "text";
        input.classList.add("overview-setting-input-text");
        input.value = value;

        this.button.appendChild(textContent);
        this.button.appendChild(input);

        parent.appendChild(this.button);

        this.input = input;
    }

    this.hide = function()
    {
        this.button.style.display = "none";
    }

    this.show = function()
    {
        this.button.style.display = "flex";
    }

    SettingsText.prototype.handleEvent = function(event) 
    {
        if (event.type === "click" && event.target.className == "overview-button")
        {
            console.log("select")
            this.input.select();
        }
    }
}