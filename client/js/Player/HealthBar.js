class ProgressBar 
{
    constructor(element, initalValue = 0)
    {
        this.valueElem = element.querySelector('.HealthBarValue');
        this.fillElem = element.querySelector('.HealthBarFill');

        


        this.setValue(initalValue);
    }

    setValue(newValue)
    {   
        if (newValue < 0)
            newValue = 0;
        else if (newValue > 100)
            newValue = 100

        this.valueElem = newValue; 
        this.Update();
    }

    Update()
    {
        // update changes in the document 
        const percentage = this.value + '%'; // 50 % or 60 % or 100 %
        this.fillElem.style.width = percentage;
        this.valueElem.textContent = percentage;
    }
}