function SettingsCheckbox()
{
    this.id = "";
    this.value = false;
    this.checkbox = null;
    this.button = null;
    const eventChecked = new CustomEvent("settingChecked");

    this.setup = function(parent, labelText, id, defaultValue)
    {
        this.id = id;

        let storedValue = localStorage.getItem(id);
        if (storedValue != null)
        {
            this.value = (storedValue === 'true');
        }
        else
        {
            this.value = defaultValue;
        }

        this.buildElement(parent, labelText, id, this.value)
        this.checkbox.addEventListener("change", this, true);
        this.button.addEventListener("click", this, false);
    }

    this.buildElement = function(parent, labelText, id, value)
    {
        this.button = document.createElement("button");
        this.button.className = "overview-button"; 

        let textContent = document.createTextNode(labelText);

        let label = document.createElement("label");
        label.className = "overview-switch"; 

        let input = document.createElement("input");
        input.type = "checkbox";
        input.id = id;
        input.checked = value;

        let span = document.createElement("span");
        span.className = "overview-slider round";

        label.appendChild(input);
        label.appendChild(span);

        this.button.appendChild(textContent);
        this.button.appendChild(label);

        parent.appendChild(this.button);

        this.checkbox = input;
    }

    this.setValue = function(value)
    {
        this.value = value;
        this.checkbox.checked = value;
    }

    this.hide = function()
    {
        // localStorage.setItem(globals.STORAGE_KEY_STORMGLASS, this.stormglassKey.input.value);
        this.button.style.display = "none";
    }

    this.show = function()
    {
        this.button.style.display = "flex";
    }

    this.save = function()
    {
        localStorage.setItem(this.id, this.value);
    }

    SettingsCheckbox.prototype.handleEvent = function(event) 
    {
        if (event.type === "change")
        {
            this.value = this.checkbox.checked;
            this.button.dispatchEvent(eventChecked);
        }
        if (event.type === "click" && event.target.className == "overview-button")
        {
            this.checkbox.checked = !this.checkbox.checked;
            this.value = this.checkbox.checked;
            this.button.dispatchEvent(eventChecked);
        }
    }
}