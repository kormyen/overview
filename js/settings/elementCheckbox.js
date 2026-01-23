function ElementCheckbox()
{
    this.id = "";
    this.value = false;
    this.checkbox = null;
    this.button = null;
    this.eventChecked = null;

    this.defaultValue = false;

    this.setup = function(parent, labelText, id, defaultValue, eventName = "settingChecked")
    {
        this.id = id;
        this.defaultValue = defaultValue;

        let storedValue = localStorage.getItem(id);
        if (storedValue != null)
        {
            this.value = (storedValue === 'true');
        }
        else
        {
            this.value = defaultValue;
        }

        this.eventChecked = new Event(eventName);
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

    ElementCheckbox.prototype.handleEvent = function(event) 
    {
        if (event.type === "change")
        {
            this.value = this.checkbox.checked;
            this.button.dispatchEvent(this.eventChecked);
        }
        if (event.type === "click" && event.target.className == "overview-button")
        {
            this.checkbox.checked = !this.checkbox.checked;
            this.value = this.checkbox.checked;
            this.button.dispatchEvent(this.eventChecked);
        }
    }
}