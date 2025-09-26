export function code(content: string, type?: string){
    return `\`\`\`${type}\n${content}\`\`\``;
}

export function quote(content: string){
    return `\`${content}\``;
}