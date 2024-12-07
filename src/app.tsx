import { useState, useRef, useEffect } from "preact/hooks";
import { ChangeEvent } from "preact/compat";
import { applyGayscale } from "./gaycale.ts";
import { colors, blendModes, flags } from "./options.ts";

export function App() {
  const [error, setError] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [flag, setFlag] = useState<string>("LGBT Flag");
  const [color, setColor] = useState<string>("Rainbow");
  const [gmode, setGMode] = useState<boolean>(false);
  const [blendMode, setBlendMode] = useState<string>("atop");

  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    setError("");
    setImageLoaded(false);

    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0);
              setImageLoaded(true);
            }
          }
        };
        if (e.target?.result) {
          img.src = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div class="w-full">
      <Navbar></Navbar>
      <div class="flex justify-center m-5 items-center flex-col lg:flex-row">
        <canvas
          className="max-h-[calc(100vh-7rem)] outline outline-2 outline-primary rounded-lg p-1 shadow-md bg-base-100"
          ref={canvasRef}
        />

        <div class="flex flex-col justify-center ml-5">
          {error && <div>{error}</div>}

          <input
            class="file-input file-input-bordered file-input-primary w-full max-w-xs mb-5"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {imageLoaded && (
            <>
              <label>Pride Flag</label>
              <select
                class="input input-bordered w-full max-w-xs mb-1"
                onChange={(event: ChangeEvent) => {
                  const input = event.target as HTMLSelectElement;
                  setFlag(input.value);
                }}
              >
                {Object.keys(flags).map((element) => (
                  <option>{element}</option>
                ))}
              </select>

              <label>Colorscheme</label>
              <select
                class="input input-bordered w-full max-w-xs mb-1"
                onChange={(event: ChangeEvent) => {
                  const input = event.target as HTMLSelectElement;
                  setColor(input.value);
                }}
              >
                {Object.keys(colors).map((element) => (
                  <option>{element}</option>
                ))}
              </select>

              <label>Blend Mode</label>
              <select
                class="input input-bordered w-full max-w-xs mb-1"
                onChange={(event: ChangeEvent) => {
                  const input = event.target as HTMLSelectElement;
                  setBlendMode(input.value);
                }}
              >
                {blendModes.map((element) => (
                  <option>{element}</option>
                ))}
              </select>

              <label>Gradient Transition</label>
              <select
                class="input input-bordered w-full max-w-xs mb-5"
                onChange={(event: ChangeEvent) => {
                  const input = event.target as HTMLSelectElement;
                  setGMode(input.value == "Yes");
                }}
              >
                <option>No</option>
                <option>Yes</option>
              </select>

              <button
                class="btn btn-primary"
                onClick={() => {
                  if (canvasRef.current == null) return;
                  applyGayscale(
                    canvasRef.current,
                    flag,
                    color,
                    blendMode,
                    gmode,
                  );
                }}
              >
                Gayscale
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Navbar() {
  const [isdark, setIsdark] = useState(
    JSON.parse(localStorage.getItem("isdark") ?? "false"),
  );
  useEffect(() => {
    localStorage.setItem("isdark", JSON.stringify(isdark));
    document.documentElement.setAttribute(
      "data-theme",
      isdark ? "dark" : "light",
    );
  }, [isdark]);

  return (
    <div class="navbar bg-base-200">
      <div class="flex-1">
        <a class="btn btn-ghost text-xl">Gayscale</a>
      </div>
      <div class="flex-none">
        <label class="swap swap-rotate">
          <input
            type="checkbox"
            value="sunset"
            checked={isdark}
            onChange={() => setIsdark(!isdark)}
          />

          <svg
            class="swap-off h-10 w-10 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>

          <svg
            class="swap-on h-10 w-10 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>
      </div>
    </div>
  );
}
