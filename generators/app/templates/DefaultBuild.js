export default function(InternComponent) { 
    return {
        name: "DefaultBuild",
        components: { InternComponent },
        template: `
            <Default>
                <intern-component></intern-component>
            </Default>
        `
    };
}
