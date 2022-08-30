const workflow = (
    function() {
        
        function init(){     

            
            // PRETEND TO BE THE PLAN MODULE            
            const viewerBtnOpts = {
                text: 'Launch Viewer',
                style: 'secondary',
                type: 'contained',
                callback: () => WorkflowViewerComponent.open(WorkflowProcess.CONSUMER_PLAN_ANNUAL, '686614946775502')
            };
            const viewerBtn = button.build(viewerBtnOpts);
            viewerBtn.style = "margin: 20px";

            const btnWrap = document.createElement('div');
            btnWrap.classList.add('landingBtnWrap');

            btnWrap.appendChild(viewerBtn);

            DOM.clearActionCenter();
            DOM.ACTIONCENTER.appendChild(btnWrap);
            
        }     

        return {
            init
        }

    }
)();