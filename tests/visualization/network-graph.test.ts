import { describe, it, expect } from 'vitest';
import { NetworkGraphViz } from '../../src/visualization/network-graph';

describe('NetworkGraphViz', () => {
  it('can be instantiated', () => {
    const viz = new NetworkGraphViz();
    expect(viz).toBeInstanceOf(NetworkGraphViz);
  });

  it('exposes render method', () => {
    const viz = new NetworkGraphViz();
    expect(typeof viz.render).toBe('function');
  });

  it('exposes update method', () => {
    const viz = new NetworkGraphViz();
    expect(typeof viz.update).toBe('function');
  });

  it('exposes onNodeSelect method', () => {
    const viz = new NetworkGraphViz();
    expect(typeof viz.onNodeSelect).toBe('function');
  });

  it('exposes animateCascade method', () => {
    const viz = new NetworkGraphViz();
    expect(typeof viz.animateCascade).toBe('function');
  });

  it('exposes destroy method', () => {
    const viz = new NetworkGraphViz();
    expect(typeof viz.destroy).toBe('function');
  });

  it('registers node select callbacks', () => {
    const viz = new NetworkGraphViz();
    const callback = () => {};
    // Should not throw
    expect(() => viz.onNodeSelect(callback)).not.toThrow();
  });

  it('update does not throw when called without render', () => {
    const viz = new NetworkGraphViz();
    const network = {
      nodes: [],
      edges: [],
      irc: 1.0,
      currentLoad: 0,
    };
    // Should gracefully handle no SVG
    expect(() => viz.update(network)).not.toThrow();
  });

  it('animateCascade does not throw when called without render', () => {
    const viz = new NetworkGraphViz();
    // Should gracefully handle no SVG
    expect(() => viz.animateCascade([])).not.toThrow();
  });

  it('destroy does not throw when called without render', () => {
    const viz = new NetworkGraphViz();
    expect(() => viz.destroy()).not.toThrow();
  });
});
