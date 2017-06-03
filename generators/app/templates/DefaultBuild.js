import Default from '../controller/fragment/Default.vue';
    
export default function(InternComponent) { 
    return {
        name: "DefaultBuild",
        components: { Default, InternComponent },
        template: `
            <Default>
                <intern-component></intern-component>
            </Default>
        `
    };
}
