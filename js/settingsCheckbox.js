function SettingsCheckbox()
{
    this.id = "";
    this.value = false;
    this.checkbox = null;
    this.button = null;

    this.setup = function(parent, labelText, id, value)
    {
        this.id = id;
        this.value = value;

        this.buildElement(parent, labelText, id, value)
        this.checkbox.addEventListener('change', this, true);

        this.button.addEventListener('click', this, true);
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

    SettingsCheckbox.prototype.handleEvent = function(event) 
    {
        if (event.type === "change")
        {
            this.value = this.checkbox.checked;
        }
        if (event.type === "click" && event.target.className == "overview-button")
        {
            this.checkbox.checked = !this.checkbox.checked;
            this.value = this.checkbox.checked;
        }
    }
}