import { fireEvent, render, screen, cleanup, waitFor } from "@testing-library/react";
import type { ComponentType } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { Route } from "@/routes/index";

const Page = Route.options.component as ComponentType;

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function openSong() {
  render(<Page />);
  for (let i = 0; i < 4; i++) fireEvent.click(screen.getByRole("button", { name: "6" }));
  fireEvent.click(screen.getByRole("button", { name: /Next/ }));
  fireEvent.click(screen.getByRole("button", { name: /Gift 2/ }));
  return screen.getByLabelText("Our song") as HTMLAudioElement;
}

describe("Surprise media", () => {
  it("includes every displayed photo and the song in the published files", () => {
    const audio = openSong();
    const urls = [...screen.getAllByRole("img").map((img) => img.getAttribute("src")), audio.getAttribute("src"), "/media/tulips.svg", "/media/cat.svg"];
    for (const url of urls) {
      expect(url).toMatch(/^\/media\//);
      expect(existsSync(resolve("public", url!.slice(1)))).toBe(true);
    }
    expect(audio).toHaveAttribute("controls");
  });

  it("shows a useful error when playback is rejected and allows retry", async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockRejectedValueOnce(new Error("Playback blocked"));
    const audio = openSong();
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("could not play");
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();

    play.mockImplementation(async () => { fireEvent.play(audio); });
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument());
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    fireEvent.pause(audio);
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  });

  it("uses the actual duration and updates seeking and volume", () => {
    const audio = openSong();
    Object.defineProperty(audio, "duration", { value: 42.5, configurable: true });
    fireEvent.loadedMetadata(audio);
    expect(screen.getByText("0:42")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("slider", { name: "Song progress" }), { target: { value: "12" } });
    expect(audio.currentTime).toBe(12);
    fireEvent.change(screen.getByRole("slider", { name: "Volume" }), { target: { value: "25" } });
    expect(audio.volume).toBe(0.25);
  });
});
