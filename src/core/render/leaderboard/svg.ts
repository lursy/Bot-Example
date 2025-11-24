import TextToSVG from "text-to-svg";
import sharp from "sharp";
import os from "node:os";


class SvgRender {
    
}
// ... seus imports de fontes e constantes ...
const FONT_SLABO_PATH = "./src/fonts/Slabo_27px/Slabo27px-Regular.ttf";
const FONT_ROWDIES_PATH = "./src/fonts/Rowdies/Rowdies-Regular.ttf";
const FONT_PM_PATH = "./src/fonts/Permanent_Marker/PermanentMarker-Regular.ttf";

const INPUT_IMAGE = "middle-top-atena.webp";
const OUTPUT_IMAGE = "./output.webp";

async function main() {
    console.time("Tempo Total");

    console.log(`🖥️ Sistema detectou ${os.cpus().length} núcleos físicos.`);

    try {
        const fontSlabo = TextToSVG.loadSync(FONT_SLABO_PATH);
        const fontRowdies = TextToSVG.loadSync(FONT_ROWDIES_PATH);
        const fontPM = TextToSVG.loadSync(FONT_PM_PATH);

        const imageInput = sharp(INPUT_IMAGE, { animated: true });
        const metadata = await imageInput.metadata();

        const width = metadata.width!;
        const pageHeight = metadata.pageHeight || metadata.height!;

        const createTextLayer = (text: string, fontInstance: TextToSVG, size: number, matrixTransform: string) => {
            const pathData = fontInstance.getPath(text, { x: 0, y: 0, fontSize: size, anchor: "top", attributes: { fill: "#fff" } });
            return `<g transform="${matrixTransform}">${pathData}</g>`;
        };

        const vectorTextSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 360" width="780" height="720">
        ${createTextLayer("18.000.000.000 Magias", fontRowdies, 17, "matrix(.9303 0 0 0.806401 182.1 76)")}
        ${createTextLayer("18.000.000.000 Magias", fontRowdies, 17, "matrix(.9303 0 0 0.806401 182.1 141)")}
        ${createTextLayer("18.000.000.000 Magias", fontRowdies, 17, "matrix(.9303 0 0 0.806401 182.1 202)")}
        ${createTextLayer("18.000.000.000 Magias", fontRowdies, 17, "matrix(.9303 0 0 0.806401 182.1 262)")}
        ${createTextLayer("18.000.000.000 Magias", fontRowdies, 17, "matrix(.9303 0 0 0.806401 182.1 325)")}

        ${createTextLayer("Teste", fontPM, 17, "translate(182.1 51)")}
        ${createTextLayer("Teste", fontPM, 17, "translate(182.1 115)")}
        ${createTextLayer("Teste", fontPM, 17, "translate(182.1 178)")}
        ${createTextLayer("Teste", fontPM, 17, "translate(182.1 238)")}
        ${createTextLayer("Teste", fontPM, 17, "translate(182.1 301)")}

        ${createTextLayer("1299126888115077150", fontSlabo, 14, "matrix(.821213 0 0 0.897351 182.1 96)")}
        ${createTextLayer("1299126888115077150", fontSlabo, 14, "matrix(.821213 0 0 0.897351 182.1 159)")}
        ${createTextLayer("1299126888115077150", fontSlabo, 14, "matrix(.821213 0 0 0.897351 182.1 220)")}
        ${createTextLayer("1299126888115077150", fontSlabo, 14, "matrix(.821213 0 0 0.897351 182.1 282)")}
        ${createTextLayer("1299126888115077150", fontSlabo, 14, "matrix(.821213 0 0 0.897351 182.1 344)")}
      </svg>
    `;
        const svgImages = `
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 780 720" width="780" height="720">
        <image width="780" height="720" xlink:href="data:image/png;base64,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" preserveAspectRatio="xMidYMid meet" transform="matrix(.442023 0 0 0.209747-12.169002 95)"/>
        <image width="780" height="720" xlink:href="data:image/png;base64,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" preserveAspectRatio="xMidYMid meet" transform="matrix(.442023 0 0 0.209747-12.169002 226)"/>
        <image width="780" height="720" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAdVBMVEVDtYH///88s30+s343snv8/v33/PpDtoIzsXn1+/nw+fX6/fw6s3zn9e7y+veq3MXX7+TM6dve8ejC5dRevpGR07W/5NJXvY5Ru4t2xp+V07ay3cfJ6dpuxp51xp+e17yBzap/zamb17tlwZau38mJzayl177dMm30AAAJ8ElEQVR4nO2dbbuqKhCGC1TMIt+VNN8y/f8/cWutykoUt1h9mPs6H87ZZ7vgERiGYZy1WgEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMBuMEUJTHkAT//4XabQpyo6lhZ8z8YdY5RcJUxQFYbxg5+aC0YqxsjpbxvrCmYg+ydzrE4Z9rjxGVugXZWJEvEMU0PUfGnXMUPThaL9+4AR+6pFfE4mQV5mWdu8lteuEKKJPkzJynU1H5MY2K++HNGLE8rgjzzjWB6JM6R9GuIwCp6NxvbfNgvyG8cEKy2z66JplFuG7ucCNBdqhxgi1tIYTvwxRM8vT01HriqR2xITnwXIo7Ew7/XJzj3S73uwaiq4rzEuK3D9l5oXs5OdF4hG9+T8doRiHqWl0NW5oLT7XFwErxNTUe4e255Lchq/dNXQdhcUptulGa9iqW/Xyd9XmX7bNH2w29Hj2E9bq/JuPmDCfdjWujdMXNeJVaD7krenpb/E1IgkLi+x5YQ3gxI1O8vdydkpqbZ8GMmNfsjnIix6vW6PXd930kpWHU0DfZIygWXVehheVaHewnyarU4VfsDmYVNa9C1vnsl4QImWVuZPV3WjsZ5WwZmUiVDxrPB4+bld3ZfywL07todYYJqfA0t76PQnNCbK0me2IVHZ3hzTM8qMSEYmcTuNJa1bKzHZmyruiOsesbHaWMLK6f2pVq88tR+QFDy1uSpDevHEqRd4VjVoV0ZGXdb25ffwxi4PSzgBWRNG9WKa8m0iTNRrdzh+pjveZmYryR5sBQ6vCeu+fHOzG+cufLE75kVHE9zadinR3jAVwfBa6nd3R2X1AIPL/WlOPSfLsZC2i8ZRknZeYf2Cekr/29ucqWFzfRWOd2ff/sIVP1f/NbQhp4H5E37rdKIK7xP3yg0j+7Iqx6Pp7QaP33f+49CCiajPUlcW4e/i0WHgQyWJbgyjBshsGyj+1+LjQdFGJJPi2wPW6XlIgTkUPtQtiLerY1N+W16BWy+nDnj3egeVxxa8LptLxub+Jutw0JfG3xV0xl1KIy+/s9m/sFxK4wtG3pd1Yyq/BP7BVXLH1ZQSW3xZ2R10mYqOcvy3sQbZIpF/5ETvTskg0A6ffltVhnywwTZXjt2V1iReYpuzr56YujnzPDUXSg75zMOTHa3Y/NUmbaSpbIfY+GXkSwBZOZREE+fvxVj8JlT1N0Q+EL56p5SrE5ddjbK8c5U5TVP3YJG2s6UHqpv8rZ98ukVSF4Y/tFS2BzE0fH37KoblCPYmD+Dun+y4yFyL7wWUoNfiNvZ+JX3Sx5F20TT8aqur433l9YvIja4mm5jSl3T213PgcWI74Fmo4dnCOXWdi0opEx80db+3e2WPkIV1RlF3oC96D06Bq0/QVHZeZPUXjWd4xWHyvsKp7/jNGJBe553AP908tsMKiCUueygoqTggjBt7Ta0XhqBHeZ+xprinJBOdC1kJEwrvhW+YZJvWwAdlH5OURFIofY2TFvnXRO7WgJ1A77NFus/cncCh8hycrHqVvx9tqscMeJwOTITMV97klqBRdi5IWIg7FmjOq3jmDUn78g5NsqGSCFnUvZyGK3oseOW4i4s5TjRecZ4Lnba2Q4poK3ldsDpxlj0re1k95Q6BEYgtDraUsRF1sVThcu6bwLAffUIiGn+VcsxGx1kxud+/5mq/wLx8UQS/KkeF840TszonfXexxHuHvZtyX8gKVkbSATmKGbeBt6v27vsOfYqJuFMd+T0MJhI416sCK0Pv3C3fgESKmcMtfG+LsxCy3MaSw/0cEA71DYgrXroSrUiZmSv9D4ZDPtRNUaM/f81EidiWzHVLY/5KGxlBwlspI40OV4NY0sOT1fltlDVganvl9hc4PuCFRH3HgZbJ+WzUw7MIZdIY/25jqoqe1E7cpbnf5L0URDl/O99uw6GGNP+d0noPC7x0Svo/tPX9Ngokq3PBGBHOdTK7PhXLhgNTs24sJF4e8m/VdzTsoaDyPhIjHauy5txf4IDxfaNrbXzxwYrf689OE7fdawnYxpTG3t79DgRqt96oaTUm25rxXcXaReDZbX1ipOSUM/QAj7/G6Jl3H7vOZY6hMyc7X/PdqESOfoNDkdQjwKpvQ5Ho993TBD7L0cnqOfiJSjRlFWjx/wIyZOanFdTRT4dSPZOLy0WGMPYHebrPwUUAJkSkh7wv1zGM+m5pH49QpQxdIkontNHaUkEu9E8QKc3LqlXglo37+I0WBHuOsqk6xK3zHolquGVV+Ftv/kVo2c8v/z69kNMOYmlC8NwzB0PoLM7+g+cFcqFdmpvCh5Cdv8LtY89y2CU7bt3DmuW24+MFUoWdmhkzx72XsvWLMU4gGfBKVfm58KX+xbOZ9mICqgXCwI7ijz+cY8aeSOu9wMXh/oLpl9olJTKPBnKyZCoeTFGLiLZ4drZ5DNOhY8e4tpShcmyvdW3aqukwfzARYWmHj2SOUW0t987W3E300+2Rhheszw7u2SpQsUR2oWyCEvbHL0pkKx32aIETNsS6fXoNuBCtua1+iZMz1n+nTrMh4UN9O22J05FBb/3c46GNzzErcjI2Sj/nFe3+WvjaoMH6jTi+ZW3jl5bEcH4Cei7CtiYnJaJUmNZ59vYbD8dPFNrhk32FMvGp+1QW78q5FIpXSHr1+tiV8EYxDgYHZ/xXEwxgxf85stfxG3eVHIVaPm2hHSslI7IlsBlZ6e5s7nVWusZ+a1KzuDTti+rXHzYuqBE6mVFKJOiUVWl5Bzm4FZZFODqYtntSsGk5jOht51+cxDoVyb6m0apG4ENoKNq7v7W7LAiuoLdJqW3R4BmypY7t1Xj5KKyNcnoTiX85bNHkGB7FgxsaKk0dX2+LIrCyiOg6OFjWeB1TdtNJiM8qTED+qCWOF5LHYQpZbiQeXojaSWuZTy22FfcK8MjnkVeVHp6whivyqytPSCwnePdWEZofYEtxxXJkfBbUdHc/YvtHnZDQ6L//gFSHk+nsFcE8J/aGbuGe2pvzCEbgQs477akbTKBJrxJCTWPqCwkTWxzablRCpiySzbo8LVRXG+DRuU4fSgERQRo+bW6dapnhLCyrjEY2zEz5HP4un50Ur0WJSDHrX7xee05sYvFOlcbr07/hojkl8jdocK3Nj4MBGzfQTdb3but0co25KaYB3Z2lF5esHNkvR7GrJuccZk1QqDoc91sYwS/LBgt6td6WXtaNp3e2r95uZ/+H5oxl1q1lZqCufL63fiGRFfXSoYWy2qoTMlgeXGteqtjEodY5ZSvTv/UaWRiXykupkxu7Rl1j2R88ar7yOqiTcfVHdjdbLvPxuFZk/dNf+xB36vjoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAF74BxxWqaOpfzVhAAAAAElFTkSuQmCC" preserveAspectRatio="xMidYMid meet" transform="matrix(.442023 0 0 0.209747-12.169002 350)"/>
        <image width="780" height="720" xlink:href="data:image/png;base64,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" preserveAspectRatio="xMidYMid meet" transform="matrix(.442023 0 0 0.209747-12.169002 472)"/>
        <image width="780" height="720" xlink:href="data:image/png;base64,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" preserveAspectRatio="xMidYMid meet" transform="matrix(.442023 0 0 0.209747-12.169002 595)"/>
      </svg>
    `;

        const [bgBuffer, textBuffer] = await Promise.all([
            sharp({
                create: { 
                    width: width, 
                    height: pageHeight, 
                    channels: 4, 
                    background: { r: 0, g: 0, b: 0, alpha: 0 } 
                }
            })
                .composite([{ input: Buffer.from(svgImages) }])
                .raw()
                .toBuffer(),
            
            sharp({
                create: { 
                    width: width, 
                    height: pageHeight, 
                    channels: 4, 
                    background: { r: 0, g: 0, b: 0, alpha: 0 } 
                }
            })
                .composite([{ input: Buffer.from(vectorTextSvg) }])
                .raw()
                .toBuffer()
        ]);

        await imageInput
            .composite([
                {
                    input: bgBuffer,
                    raw: { width, height: pageHeight, channels: 4 },
                    top: 0,
                    left: 0,
                    tile: true,
                    blend: 'dest-over'
                },
                {
                    input: textBuffer,
                    raw: { width, height: pageHeight, channels: 4 },
                    top: 0,
                    left: 0,
                    tile: true,
                    blend: 'over' 
                }
            ])
            .webp({
                quality: 50,
                loop: 0,
                effort: 0,
                smartSubsample: false,
                mixed: false
            })
            .toFile(OUTPUT_IMAGE);

        console.timeEnd("Composição Final");
        console.timeEnd("Tempo Total");

    } catch (error) {
        console.error("❌ Erro:", error);
    }
}

main();