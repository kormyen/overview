function ElementText()
{
    this.id = null;
    this.value = null;
    this.input = null;
    this.button = null;
    const eventUpdated = new CustomEvent("settingUpdated");

    this.setup = function(parent, labelText, id, defaultValue)
    {
        this.id = id;

        let storedValue = localStorage.getItem(id);
        if (storedValue != null)
        {
            this.value = storedValue;
        }
        else
        {
            this.value = defaultValue;
        }

        this.buildElement(parent, labelText, this.value)
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

    this.save = function()
    {
        this.value = this.input.value;
        localStorage.setItem(this.id, this.value);
    }

    ElementText.prototype.handleEvent = function(event) 
    {
        if (event.type === "click" && event.target.className == "overview-button")
        {
            console.log("select")
            this.input.select();
        }
    }
}